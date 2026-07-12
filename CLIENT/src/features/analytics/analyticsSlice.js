import { createSlice } from "@reduxjs/toolkit";

import {

    GetUserAnalytics,

    GetProductAnalytics,

    GetOrderAnalytics,

    GetRevenueAnalytics,

    GetRecentOrders,

    GetTopSellingProducts

} from "./analyticsThunk";



const initialState = {

    userAnalytics: null,

    productAnalytics: null,

    orderAnalytics: null,

    revenueAnalytics: [],

    recentOrders: [],

    topSellingProducts: [],

    loadingCount: 0,

    error: null

};



const analyticsSlice = createSlice({

    name: "analytics",

    initialState,

    reducers: {

        ClearAnalyticsError: (state) => {

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // User Analytics

            .addCase(GetUserAnalytics.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetUserAnalytics.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.userAnalytics =
                    action.payload.analytics || null;

            })

            .addCase(GetUserAnalytics.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            })



            // Product Analytics

            .addCase(GetProductAnalytics.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetProductAnalytics.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.productAnalytics =
                    action.payload.analytics || null;

            })

            .addCase(GetProductAnalytics.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            })



            // Order Analytics

            .addCase(GetOrderAnalytics.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetOrderAnalytics.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.orderAnalytics =
                    action.payload.analytics || null;

            })

            .addCase(GetOrderAnalytics.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            })



            // Revenue Analytics

            .addCase(GetRevenueAnalytics.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetRevenueAnalytics.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.revenueAnalytics =
                    action.payload.revenueAnalytics || [];

            })

            .addCase(GetRevenueAnalytics.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            })



            // Recent Orders

            .addCase(GetRecentOrders.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetRecentOrders.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.recentOrders =
                    action.payload.orders || [];

            })

            .addCase(GetRecentOrders.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            })



            // Top Selling Products

            .addCase(GetTopSellingProducts.pending, (state) => {

                state.loadingCount += 1;

                state.error = null;

            })

            .addCase(GetTopSellingProducts.fulfilled, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.topSellingProducts =
                    action.payload.products || [];

            })

            .addCase(GetTopSellingProducts.rejected, (state, action) => {

                state.loadingCount = Math.max(
                    0,
                    state.loadingCount - 1
                );

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearAnalyticsError

} = analyticsSlice.actions;



export default analyticsSlice.reducer;