import { Cart } from '../../models/cart.model.js';
import { Order } from '../../models/order.model.js';
import { Product } from '../../models/product.model.js';

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      totalAmount,
      orderDate,
      cartId,
    } = req.body;

    // Stock deduction
    for (let item of cartItems) {
      const product = await Product.findById(item.productId);      
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.title}`,
        });
      }


      product.totalStock -= item.quantity;
      await product.save();
    }

    // Save order
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "confirmed",
      totalAmount,
      orderDate: new Date(),
    });

    await newOrder.save();

    // Clear cart
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: "Order placed with Cash on Delivery.",
      order: newOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while placing the order.",
    });
  }
};


const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};

