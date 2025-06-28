import { CommonForm } from "@/components";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const initialstate = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialstate);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
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
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an Account
          <Link
            className="font-medium ml-2 text-primary hover:underline text-blue-600"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={false}
      />
    </div>
  );
}

export default AuthLogin;