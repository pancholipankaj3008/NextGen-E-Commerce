import { createSlice } from "@reduxjs/toolkit";

import {

    CreateCoupon,

    GetAllCoupons,

    ApplyCoupon,

    UpdateCoupon,

    DeleteCoupon

} from "./couponThunk";



const initialState = {

    coupons: [],

    appliedCoupon: null,

    discountAmount: 0,

    finalTotal: 0,

    loading: false,

    applyLoading: false,

    message: "",

    error: null

};



const couponSlice = createSlice({

    name: "coupon",

    initialState,

    reducers: {

        ClearCouponMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        RemoveAppliedCoupon: (state) => {

            state.appliedCoupon = null;

            state.discountAmount = 0;

            state.finalTotal = 0;

        }

    },

    extraReducers: (builder) => {

        builder



            // Get All Coupons

            .addCase(GetAllCoupons.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllCoupons.fulfilled, (state, action) => {

                state.loading = false;

                state.coupons =
                    action.payload.coupons || [];

            })

            .addCase(GetAllCoupons.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Create Coupon

            .addCase(CreateCoupon.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(CreateCoupon.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                if (action.payload.coupon) {

                    state.coupons.unshift(
                        action.payload.coupon
                    );

                }

            })

            .addCase(CreateCoupon.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Apply Coupon

            .addCase(ApplyCoupon.pending, (state) => {

                state.applyLoading = true;

                state.error = null;

            })

            .addCase(ApplyCoupon.fulfilled, (state, action) => {

                state.applyLoading = false;

                state.message = action.payload.message;

                state.appliedCoupon = {
                    code: action.payload.couponCode
                };

                state.discountAmount =
                    action.payload.discountAmount ?? 0;

                state.finalTotal =
                    action.payload.finalTotal ?? 0;

            })

            .addCase(ApplyCoupon.rejected, (state, action) => {

                state.applyLoading = false;

                state.error = action.payload?.message;

                state.appliedCoupon = null;

                state.discountAmount = 0;

                state.finalTotal = 0;

            })



            // Update Coupon

            .addCase(UpdateCoupon.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UpdateCoupon.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                let index = state.coupons.findIndex(
                    (coupon) =>
                        coupon._id === action.payload.id
                );

                if (index !== -1) {

                    state.coupons[index] = {

                        ...state.coupons[index],

                        ...action.payload.couponData

                    };

                }

            })

            .addCase(UpdateCoupon.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Delete Coupon

            .addCase(DeleteCoupon.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(DeleteCoupon.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.coupons = state.coupons.filter(
                    (coupon) =>
                        coupon._id !== action.payload.id
                );

            })

            .addCase(DeleteCoupon.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearCouponMessage,

    RemoveAppliedCoupon

} = couponSlice.actions;



export default couponSlice.reducer;