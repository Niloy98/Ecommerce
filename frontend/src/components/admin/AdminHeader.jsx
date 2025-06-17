import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser()).then((data) => {
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
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b ">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block bg-black text-white"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <Button
        onClick={() => navigate("/admin/dashboard")}
        className="lg:hidden sm:block"
      >
        <div className="flex flex-row h-full gap-2">
          <span>Admin Panel</span>
        </div>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-4 text-sm shadow font-medium bg-black text-white"
        >
          <LogOut />
          Logout
        </Button>
      </div>
      <ToastContainer />
    </header>
  );
}

export default AdminHeader;
