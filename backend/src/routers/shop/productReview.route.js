import express from "express";
import { addProductReview, getProductReviews } from "../../controllers/shop/productReview.controller.js";

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

export default router;