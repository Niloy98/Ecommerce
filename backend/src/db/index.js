import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const responce = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGODB connect successfully");
        return responce;
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
};

export default connectDb;