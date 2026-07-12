import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    GetWishlistAPI,

    AddToWishlistAPI,

    RemoveWishlistAPI

} from "./wishlistAPI";



export const GetWishlist = createAsyncThunk("wishlist/getWishlist", async (_, thunkAPI) => {

        try {

            const res = await GetWishlistAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch wishlist"
                }
            );

        }

    }

);



export const AddToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId, thunkAPI) => {

        try {

            const res = await AddToWishlistAPI(productId);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to add product to wishlist"
                }
            );

        }

    }

);



export const RemoveWishlist = createAsyncThunk("wishlist/removeWishlist", async (productId, thunkAPI) => {

        try {

            const res = await RemoveWishlistAPI(productId);

            return {
                ...res.data,
                productId
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to remove product from wishlist"
                }
            );

        }

    }

);