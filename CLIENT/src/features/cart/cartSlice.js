import { createSlice } from "@reduxjs/toolkit";

import {

    GetCart,

    AddToCart,

    UpdateCartQuantity,

    RemoveCartItem,

    ClearCart

} from "./cartThunk";



const initialState = {

    cart: null,

    items: [],

    totalItems: 0,

    subtotal: 0,

    loading: false,

    actionLoading: false,

    message: "",

    error: null

};



const cartSlice = createSlice({

    name: "cart",

    initialState,

    reducers: {

        ClearCartMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        ResetCart: (state) => {

            state.cart = null;

            state.items = [];

            state.totalItems = 0;

            state.subtotal = 0;

        }

    },

    extraReducers: (builder) => {

        builder



            // Get Cart

            .addCase(GetCart.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetCart.fulfilled, (state, action) => {

                state.loading = false;

                state.cart = action.payload.cart;

                state.items =
                    action.payload.cart?.items || [];

                state.totalItems =
                    action.payload.totalItems ||
                    action.payload.totalQuantity ||
                    0;

                state.subtotal =
                    action.payload.subtotal || 0;

            })

            .addCase(GetCart.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Add To Cart

            .addCase(AddToCart.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(AddToCart.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                if (action.payload.cart) {

                    state.cart = action.payload.cart;

                    state.items =
                        action.payload.cart.items || [];

                }

                state.totalItems =
                    action.payload.totalItems ||
                    action.payload.totalQuantity ||
                    state.items.reduce(
                        (total, item) =>
                            total + item.quantity,
                        0
                    );

                state.subtotal =
                    action.payload.subtotal ||
                    state.subtotal;

            })

            .addCase(AddToCart.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Update Cart Quantity

            .addCase(UpdateCartQuantity.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(UpdateCartQuantity.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                if (action.payload.cart) {

                    state.cart = action.payload.cart;

                    state.items =
                        action.payload.cart.items || [];

                }

                state.totalItems =
                    action.payload.totalItems ||
                    action.payload.totalQuantity ||
                    state.items.reduce(
                        (total, item) =>
                            total + item.quantity,
                        0
                    );

                state.subtotal =
                    action.payload.subtotal || 0;

            })

            .addCase(UpdateCartQuantity.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Remove Cart Item

            .addCase(RemoveCartItem.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(RemoveCartItem.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                if (action.payload.cart) {

                    state.cart = action.payload.cart;

                    state.items =
                        action.payload.cart.items || [];

                }

                state.totalItems =
                    action.payload.totalItems ||
                    action.payload.totalQuantity ||
                    0;

                state.subtotal =
                    action.payload.subtotal || 0;

            })

            .addCase(RemoveCartItem.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Clear Cart

            .addCase(ClearCart.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(ClearCart.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                state.cart = null;

                state.items = [];

                state.totalItems = 0;

                state.subtotal = 0;

            })

            .addCase(ClearCart.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearCartMessage,

    ResetCart

} = cartSlice.actions;



export default cartSlice.reducer;
