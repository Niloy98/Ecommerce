import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if(!username || !password || !email){
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email){
      return res.status(400).json({
        success: false,
        message: "email is required"
      })
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        username: checkUser.username,
      },
      process.env.CLIENT_SECRET_KEY,
      {
        expiresIn: process.env.CLIENT_SECRET_TOKEN_EXPIRY
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        username: checkUser.username,
      },
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware
}
