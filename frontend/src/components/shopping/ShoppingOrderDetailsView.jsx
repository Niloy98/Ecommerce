import { useSelector } from "react-redux";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
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
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'outline';
      case 'cancelled':
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getItemSubtotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6 p-2">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <p className="text-sm text-gray-500 mt-1">Review your order information</p>
        </div>

        <div className="grid gap-4">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center">
            📋 Order Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Order ID</p>
              <Label className="font-mono text-sm bg-white px-2 py-1 rounded border">
                {orderDetails?._id}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Order Date</p>
              <Label className="text-sm">
                {orderDetails?.orderDate ? formatDate(orderDetails.orderDate) : 'N/A'}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Total Amount</p>
              <Label className="text-lg font-bold text-green-600">
                {formatCurrency(orderDetails?.totalAmount || 0)}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Payment Status</p>
              <Badge variant={getStatusVariant(orderDetails?.paymentStatus)}>
                {orderDetails?.paymentStatus || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Order Status</p>
              <Badge variant={getStatusVariant(orderDetails?.orderStatus)}>
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
            <Badge variant="outline" className="text-xs">
              {orderDetails?.cartItems?.length || 0} items
            </Badge>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold text-center">Quantity</TableHead>
                  <TableHead className="font-semibold text-right">Unit Price</TableHead>
                  <TableHead className="font-semibold text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-10 h-10 object-cover rounded border"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="text-sm">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="px-2 py-1">
                            {item.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(getItemSubtotal(item))}
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No items found in this order
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
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
                <span className="font-medium text-gray-700 w-20">Name:</span>
                <span className="text-gray-600">{user?.username || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-700 w-20">Address:</span>
                <div className="text-gray-600 flex-1">
                  <div>{orderDetails?.addressInfo?.address || 'N/A'}</div>
                  <div className="mt-1">
                    {orderDetails?.addressInfo?.city && (
                      <span>{orderDetails.addressInfo.city}</span>
                    )}
                    {orderDetails?.addressInfo?.pincode && (
                      <span className="ml-2">- {orderDetails.addressInfo.pincode}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-20">Phone:</span>
                <span className="text-gray-600">{orderDetails?.addressInfo?.phone || 'N/A'}</span>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-700 w-20">Notes:</span>
                  <span className="text-gray-600 italic">{orderDetails.addressInfo.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Order Value</span>
            <span className="text-2xl font-bold">
              {formatCurrency(orderDetails?.totalAmount || 0)}
            </span>
          </div>
          <p className="text-xs opacity-80 mt-1">Including all applicable taxes and fees</p>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;