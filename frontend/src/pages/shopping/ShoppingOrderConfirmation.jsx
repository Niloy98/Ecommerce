import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createNewOrder } from "@/store/shop/shoppingOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ShoppingOrderConfirmation({ currentSelectedAddress, totalCartAmount }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  function orderConfirmation() {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed.");
      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "confirmed",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Order confirmed");
        navigate("/shop/account")
      } else {
        toast.error("Something went wrong. Please try again later.");
        navigate("/shop/checkout")
      }
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-lg max-h-[90vh] shadow-2xl border-0 bg-white flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-lg flex-shrink-0">
          <CardTitle className="text-center text-2xl font-bold">
            🛒 Order Confirmation
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-4 border border-gray-200">
            <h3 className="font-bold text-gray-800 flex items-center text-lg">
              📦 Order Summary
            </h3>
            
            <div className="space-y-4">
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Items Ordered:</span>
                  <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {cartItems?.items?.length || 0} items
                  </span>
                </div>
                
                {cartItems?.items?.length > 0 && (
                  <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-100 shadow-sm max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {cartItems.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            ${item?.salePrice > 0 ? item?.salePrice : item?.price} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm font-semibold text-gray-700">
                              ×{item.quantity}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${((item?.salePrice > 0 ? item?.salePrice : item?.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-black to-gray-800 rounded-lg p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${totalCartAmount}</span>
                    <p className="text-xs opacity-80 mt-1">Including all taxes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {currentSelectedAddress && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 space-y-3 border border-blue-200">
              <h3 className="font-bold text-gray-800 flex items-center text-lg">
                📍 Delivery Address
              </h3>
              <div className="bg-white rounded-lg p-4 space-y-2 border border-blue-100">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-20">Address:</span>
                    <span className="text-gray-600 flex-1">{currentSelectedAddress.address}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-20">City:</span>
                    <span className="text-gray-600 flex-1">{currentSelectedAddress.city}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-20">Pincode:</span>
                    <span className="text-gray-600 flex-1">{currentSelectedAddress.pincode}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-20">Phone:</span>
                    <span className="text-gray-600 flex-1">{currentSelectedAddress.phone}</span>
                  </div>
                  {currentSelectedAddress.notes && (
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-20">Notes:</span>
                      <span className="text-gray-600 flex-1 italic">{currentSelectedAddress.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 p-6 pt-0 flex-shrink-0 border-t border-gray-100 bg-gray-50">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={orderConfirmation}
            className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2.5"
          >
            Confirm Order
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}

export default ShoppingOrderConfirmation;