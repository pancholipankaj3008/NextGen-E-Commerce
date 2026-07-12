import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    GetAllProductsAPI,

    GetSingleProductAPI,

    GetFeaturedProductsAPI,

    GetTrendingProductsAPI,

    GetNewArrivalsAPI,

    GetRelatedProductsAPI,

    AddProductAPI,

    UpdateProductAPI,

    DeleteProductAPI

} from "./productAPI";



export const GetAllProducts = createAsyncThunk("product/getAllProducts", async (params, thunkAPI) => {

        try {

            const res = await GetAllProductsAPI(params);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch products"
                }
            );

        }

    }

);



export const GetSingleProduct = createAsyncThunk("product/getSingleProduct", async (slug, thunkAPI) => {

        try {

            const res = await GetSingleProductAPI(slug);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch product"
                }
            );

        }

    }

);



export const GetFeaturedProducts = createAsyncThunk("product/getFeaturedProducts", async (_, thunkAPI) => {

        try {

            const res = await GetFeaturedProductsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch featured products"
                }
            );

        }

    }

);



export const GetTrendingProducts = createAsyncThunk("product/getTrendingProducts", async (_, thunkAPI) => {

        try {

            const res = await GetTrendingProductsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch trending products"
                }
            );

        }

    }

);



export const GetNewArrivals = createAsyncThunk("product/getNewArrivals", async (_, thunkAPI) => {

        try {

            const res = await GetNewArrivalsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch new arrivals"
                }
            );

        }

    }

);



export const GetRelatedProducts = createAsyncThunk("product/getRelatedProducts", async (productId, thunkAPI) => {

        try {

            const res = await GetRelatedProductsAPI(productId);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch related products"
                }
            );

        }

    }

);



export const AddProduct = createAsyncThunk("product/addProduct", async (productData, thunkAPI) => {

        try {

            const res = await AddProductAPI(productData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to add product"
                }
            );

        }

    }

);



export const UpdateProduct = createAsyncThunk("product/updateProduct", async ({ id, productData }, thunkAPI) => {

        try {

            const res = await UpdateProductAPI(
                id,
                productData
            );

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update product"
                }
            );

        }

    }

);



export const DeleteProduct = createAsyncThunk("product/deleteProduct", async (id, thunkAPI) => {

        try {

            const res = await DeleteProductAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to delete product"
                }
            );

        }

    }

);