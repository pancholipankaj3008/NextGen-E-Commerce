import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    GetCartAPI,

    AddToCartAPI,

    UpdateCartQuantityAPI,

    RemoveCartItemAPI,

    ClearCartAPI

} from "./cartAPI";


export const GetCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {

        try {

            const res = await GetCartAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch cart"
                }
            );

        }

    }

);


export const AddToCart = createAsyncThunk("cart/addToCart", async (cartData, thunkAPI) => {

        try {

            const res = await AddToCartAPI(cartData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to add product to cart"
                }
            );

        }

    }

);


export const UpdateCartQuantity = createAsyncThunk("cart/updateCartQuantity", async ({ cartItemId, quantity }, thunkAPI) => {

        try {

            const res = await UpdateCartQuantityAPI(
                cartItemId,
                quantity
            );

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update cart quantity"
                }
            );

        }

    }

);


export const RemoveCartItem = createAsyncThunk("cart/removeCartItem", async (payload, thunkAPI) => {

        try {

            const cartItemId =
                typeof payload === "object"
                    ? payload.cartItemId
                    : payload;

            const res = await RemoveCartItemAPI(
                cartItemId
            );

            return {
                ...res.data,
                cartItemId
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to remove cart item"
                }
            );

        }

    }

);


export const ClearCart = createAsyncThunk("cart/clearCart", async (_, thunkAPI) => {

        try {

            const res = await ClearCartAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to clear cart"
                }
            );

        }

    }

);
