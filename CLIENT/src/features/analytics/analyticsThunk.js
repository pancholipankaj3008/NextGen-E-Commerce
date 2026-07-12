import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    GetUserAnalyticsAPI,

    GetProductAnalyticsAPI,

    GetOrderAnalyticsAPI,

    GetRevenueAnalyticsAPI,

    GetRecentOrdersAPI,

    GetTopSellingProductsAPI

} from "./analyticsAPI";



export const GetUserAnalytics = createAsyncThunk("analytics/getUserAnalytics", async (_, thunkAPI) => {

        try {

            const res = await GetUserAnalyticsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch user analytics"
                }
            );

        }

    }

);



export const GetProductAnalytics = createAsyncThunk("analytics/getProductAnalytics", async (_, thunkAPI) => {

        try {

            const res = await GetProductAnalyticsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch product analytics"
                }
            );

        }

    }

);



export const GetOrderAnalytics = createAsyncThunk("analytics/getOrderAnalytics", async (_, thunkAPI) => {

        try {

            const res = await GetOrderAnalyticsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch order analytics"
                }
            );

        }

    }

);



export const GetRevenueAnalytics = createAsyncThunk("analytics/getRevenueAnalytics", async (params, thunkAPI) => {

        try {

            const res = await GetRevenueAnalyticsAPI(params);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch revenue analytics"
                }
            );

        }

    }

);



export const GetRecentOrders = createAsyncThunk("analytics/getRecentOrders", async (_, thunkAPI) => {

        try {

            const res = await GetRecentOrdersAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch recent orders"
                }
            );

        }

    }

);



export const GetTopSellingProducts = createAsyncThunk("analytics/getTopSellingProducts", async (_, thunkAPI) => {

        try {

            const res = await GetTopSellingProductsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch top selling products"
                }
            );

        }

    }

);