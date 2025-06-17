import { CommonForm } from "@/components";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialstate = {
  username: "",
  email: "",
  password: "",
};
 
function AuthRegister() {
  const [formData, setFormData] = useState(initialstate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setTimeout(() => navigate("/auth/login"), 1000)
      } else {
        toast.error(data.payload?.message, {
          className: "bg-red-500 text-white",
        });
      }
    });
  }


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new Account
        </h1>
        <p className="mt-2">
          Already have an Account
          <Link
            className="font-medium ml-2 text-primary hover:underline text-blue-600"
            to="/auth/login"
          >
            Sign In
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Create Account"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={false}
      />
      <ToastContainer />
    </div>
  );
}

export default AuthRegister;
