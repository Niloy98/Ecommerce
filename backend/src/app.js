import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from "./routers/auth/auth.route.js";

import adminProductsRouter from "./routers/admin/products.route.js";
import adminOrderRouter from "./routers/admin/order.route.js";

import shopProductsRouter from "./routers/shop/products.route.js";
import shopCartRouter from "./routers/shop/cart.route.js";
import shopAddressRouter from "./routers/shop/address.route.js";
import shopSearchRouter from "./routers/shop/search.route.js";
import shopOrderRouter from "./routers/shop/order.route.js";
import shopProductReviewRouter from "./routers/shop/productReview.route.js";

import commonFeatureRouter from "./routers/common/feature.route.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// auth
app.use("/api/auth", authRouter);

// admin
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

// shop
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/review", shopProductReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

export { app };