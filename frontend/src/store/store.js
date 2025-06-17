import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import adminProductsSlice from "./admin/productsSlice";
import adminOrderSlice from "./admin/adminOrderSlice";

import shoppingProductsSlice from "./shop/shoppingProductSlice";
import shopCartSlice from "./shop/shoppingCartSlice";
import shopAddressSlice from "./shop/shoppingAddressSlice";
import shopOrderSlice from "./shop/shoppingOrderSlice";
import shopSearchSlice from "./shop/shoppingSearchSlice";
import shopReviewSlice from "./shop/reviewSlice";

import commonFeatureSlice from "./common/commonFeatureSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shoppingProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
