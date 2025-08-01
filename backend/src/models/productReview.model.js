import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    username: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

export const ProductReview = mongoose.model("ProductReview", productReviewSchema);