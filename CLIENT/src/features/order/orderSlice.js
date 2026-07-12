import { createSlice } from "@reduxjs/toolkit";

import {

    CreateOrder,

    GetMyOrders,

    GetSingleOrder,

    CancelOrder,

    GetAllOrders,

    UpdateOrderStatus

} from "./orderThunk";



const initialState = {

    myOrders: [],

    allOrders: [],

    order: null,

    createdOrder: null,

    totalOrders: 0,

    totalPages: 0,

    currentPage: 1,

    loading: false,

    actionLoading: false,

    message: "",

    error: null

};



const orderSlice = createSlice({

    name: "order",

    initialState,

    reducers: {

        ClearOrderMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        ClearSingleOrder: (state) => {

            state.order = null;

        },

        ClearCreatedOrder: (state) => {

            state.createdOrder = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Create Order

            .addCase(CreateOrder.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(CreateOrder.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                state.createdOrder =
                    action.payload.order || null;

                if (action.payload.order) {

                    state.myOrders.unshift(
                        action.payload.order
                    );

                }

            })

            .addCase(CreateOrder.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Get My Orders

            .addCase(GetMyOrders.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetMyOrders.fulfilled, (state, action) => {

                state.loading = false;

                state.myOrders =
                    action.payload.orders || [];

            })

            .addCase(GetMyOrders.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Get Single Order

            .addCase(GetSingleOrder.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetSingleOrder.fulfilled, (state, action) => {

                state.loading = false;

                state.order =
                    action.payload.order || null;

            })

            .addCase(GetSingleOrder.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Cancel Order

            .addCase(CancelOrder.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(CancelOrder.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                let index = state.myOrders.findIndex(
                    (order) =>
                        order._id === action.payload.id
                );

                if (index !== -1) {

                    if (action.payload.order) {

                        state.myOrders[index] =
                            action.payload.order;

                    }

                    else {

                        state.myOrders[index].orderStatus =
                            "Cancelled";

                    }

                }

                if (
                    state.order?._id ===
                    action.payload.id
                ) {

                    if (action.payload.order) {

                        state.order =
                            action.payload.order;

                    }

                    else {

                        state.order.orderStatus =
                            "Cancelled";

                    }

                }

            })

            .addCase(CancelOrder.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Get All Orders

            .addCase(GetAllOrders.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllOrders.fulfilled, (state, action) => {

                state.loading = false;

                state.allOrders =
                    action.payload.orders || [];

                state.totalOrders =
                    action.payload.totalOrders ?? 0;

                state.totalPages =
                    action.payload.totalPages ?? 0;

                state.currentPage =
                    action.payload.currentPage ?? 1;

            })

            .addCase(GetAllOrders.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Update Order Status

            .addCase(UpdateOrderStatus.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(UpdateOrderStatus.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                let index = state.allOrders.findIndex(
                    (order) =>
                        order._id === action.payload.id
                );

                if (index !== -1) {

                    if (action.payload.order) {

                        state.allOrders[index] =
                            action.payload.order;

                    }

                    else {

                        state.allOrders[index].orderStatus =
                            action.payload.status;

                    }

                }

                if (
                    state.order?._id ===
                    action.payload.id
                ) {

                    if (action.payload.order) {

                        state.order =
                            action.payload.order;

                    }

                    else {

                        state.order.orderStatus =
                            action.payload.status;

                    }

                }

            })

            .addCase(UpdateOrderStatus.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearOrderMessage,

    ClearSingleOrder,

    ClearCreatedOrder

} = orderSlice.actions;



export default orderSlice.reducer;