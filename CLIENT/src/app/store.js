import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import addressReducer from "../features/address/addressSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import productReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";
import reviewReducer from "../features/review/reviewSlice";
import couponReducer from "../features/coupon/couponSlice";
import newsletterReducer from "../features/newsletter/newsletterSlice";
import orderReducer from "../features/order/orderSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import adminReducer from "../features/admin/adminSlice";




export const store = configureStore({

    reducer: {

        auth: authReducer,
        user: userReducer,
        address: addressReducer,
        wishlist: wishlistReducer,
        product: productReducer,
        cart: cartReducer,
        review: reviewReducer,
        coupon: couponReducer,
        newsletter: newsletterReducer,
        order: orderReducer,
        analytics: analyticsReducer,
        admin: adminReducer,




        

    }

});
