import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Address, UserCartItemsContent } from "@/components";
import ShoppingOrderConfirmation from "./ShoppingOrderConfirmation.jsx";
import { toast, ToastContainer } from "react-toastify";

function ShoppingCheckout() {
  const [orderConfromation, setOrderConfromation] = useState(false)
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

      function handleCheckout(){
        if(currentSelectedAddress){
          setOrderConfromation(true);
        } else{
          toast.error("Please Select an Address")
          return
        }
        
        if(!cartItems || !cartItems.items || cartItems.items.length === 0){
          setOrderConfromation(false);
          toast.error("Add items in Cart.")
        }

      }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
            onClick={handleCheckout}
            className="w-full bg-black text-white">
                Checkout
            </Button>
            {orderConfromation ? <ShoppingOrderConfirmation currentSelectedAddress={currentSelectedAddress} totalCartAmount={totalCartAmount} /> : null}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ShoppingCheckout;

