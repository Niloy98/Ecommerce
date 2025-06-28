import { Outlet } from "react-router-dom";
import Img from "../../assets/ShopmartLogo.png";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12 ">
        <img 
          src={Img}
          alt="ShopMart"
        />
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
