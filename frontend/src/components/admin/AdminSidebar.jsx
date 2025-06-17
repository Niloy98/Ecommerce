import {
  LayoutDashboard,
  ListOrdered,
  ShoppingBasket,
  Target,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ListOrdered />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((items) => (
        <div
          key={items.id}
          onClick={() => {
            navigate(items.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          {items.icon}
          <span>{items.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64  bg-white">
          <div className="flex flex-col h-full">
            <SheetHeader
              className="border-b"
              onClick={() => {
                navigate("/admin/dashboard");
                setOpen ? setOpen(false) : null;
              }}
            >
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <Target size={30} />
                <span>Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Target size={30} />
          <h2 className="font-extrabold text-2xl">Admin Panel</h2>
        </div>
        <MenuItems />
      </aside>
    </>
  );
}

export default AdminSidebar;
