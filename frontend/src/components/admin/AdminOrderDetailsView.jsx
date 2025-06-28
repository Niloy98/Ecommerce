import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { CommonForm } from "..";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/adminOrderSlice";
import { toast } from "sonner";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
      case 'paid':
        return 'default';
      case 'pending':
      case 'inprocess':
        return 'secondary';
      case 'inshipping':
        return 'outline';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const getTotalQuantity = () => {
    return orderDetails?.cartItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  };

  const getItemSubtotal = (item) => {
    return ((item.price || 0) * (item.quantity || 0)).toFixed(2);
  };

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    if (!status) {
      toast.error("Please select a status to update");
      return;
    }

    setIsUpdating(true);

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      setIsUpdating(false);
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message || "Order status updated successfully");
      } else {
        toast.error(data?.payload?.message || "Failed to update order status");
      }
    }).catch((error) => {
      setIsUpdating(false);
      toast.error("An error occurred while updating the order status");
    });
  }

  const quickStatusButtons = [
    { status: 'confirmed', label: 'Confirm', variant: 'default' },
    { status: 'inProcess', label: 'Process', variant: 'secondary' },
    { status: 'inShipping', label: 'Ship', variant: 'outline' },
    { status: 'delivered', label: 'Deliver', variant: 'default' },
  ];

  const handleQuickStatusUpdate = (status) => {
    setFormData({ status });
    const event = { preventDefault: () => {} };
    handleUpdateStatus(event);
  };

  return (
    <DialogContent className="sm:max-w-[800px] bg-white max-h-[95vh] overflow-y-auto">
      <div className="grid gap-6 p-2">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">Review and manage order details</p>
        </div>

        <div className="grid gap-4">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center">
            📋 Order Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Order ID</p>
              <Label className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {orderDetails?._id || 'N/A'}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Order Date</p>
              <Label className="text-sm">
                {formatDate(orderDetails?.orderDate)}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Total Amount</p>
              <Label className="text-lg font-bold text-green-600">
                {formatCurrency(orderDetails?.totalAmount)}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Payment Status</p>
              <Badge variant={getStatusVariant(orderDetails?.paymentStatus)}>
                {orderDetails?.paymentStatus || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Current Order Status</p>
              <Badge variant={getStatusVariant(orderDetails?.orderStatus)} className="text-sm px-3 py-1">
                {orderDetails?.orderStatus || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              🛍️ Order Items
            </h3>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                {orderDetails?.cartItems?.length || 0} products
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {getTotalQuantity()} total items
              </Badge>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {orderDetails.cartItems.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.title}</h4>
                          <p className="text-sm text-gray-500">
                            Unit Price: {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Quantity</p>
                          <Badge variant="outline" className="mt-1 px-3 py-1">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="font-bold text-gray-900 mt-1">
                            {formatCurrency(getItemSubtotal(item))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No items found in this order
              </div>
            )}
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center">
            🚚 Shipping Information
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">Customer:</span>
                <span className="text-gray-600">{user?.userName || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-700 w-24">Address:</span>
                <div className="text-gray-600 flex-1">
                  <div>{orderDetails?.addressInfo?.address || 'N/A'}</div>
                  <div className="mt-1 flex items-center space-x-4">
                    {orderDetails?.addressInfo?.city && (
                      <span>{orderDetails.addressInfo.city}</span>
                    )}
                    {orderDetails?.addressInfo?.pincode && (
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {orderDetails.addressInfo.pincode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">Phone:</span>
                <span className="text-gray-600">{orderDetails?.addressInfo?.phone || 'N/A'}</span>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 w-24">Notes:</span>
                  <span className="text-gray-600 italic bg-yellow-50 px-2 py-1 rounded">
                    {orderDetails.addressInfo.notes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center">
            ⚙️ Order Status Management
          </h3>
          
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Detailed Status Update</h4>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                    { id: "confirmed", label: "Confirmed" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={isUpdating ? "Updating..." : "Update Order Status"}
              onSubmit={handleUpdateStatus}
              isButtonDisabled={isUpdating}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">Total Order Value</span>
              <p className="text-xs opacity-80 mt-1">Including all applicable taxes and fees</p>
            </div>
            <span className="text-2xl font-bold">
              {formatCurrency(orderDetails?.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;