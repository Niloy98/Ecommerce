import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  // cartItems: [
  //   {
  //     productId: String,
  //     title: String,
  //     image: String,
  //     price: String,
  //     quantity: Number,
  //   },
  // ],
  cartItems: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: String,
    image: String,
    price: String, // currently you have it as String, but should be Number
    quantity: Number,
  },
],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  // paymentMethod: String,
  // paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  // orderUpdateDate: Date,
  // paymentId: String,
  // payerId: String,
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);