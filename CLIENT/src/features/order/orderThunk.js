import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    CreateOrderAPI,

    GetMyOrdersAPI,

    GetSingleOrderAPI,

    CancelOrderAPI,

    GetAllOrdersAPI,

    UpdateOrderStatusAPI

} from "./orderAPI";



export const CreateOrder = createAsyncThunk("order/createOrder", async (orderData, thunkAPI) => {

        try {

            const res = await CreateOrderAPI(orderData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to create order"
                }
            );

        }

    }

);



export const GetMyOrders = createAsyncThunk("order/getMyOrders", async (_, thunkAPI) => {

        try {

            const res = await GetMyOrdersAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch orders"
                }
            );

        }

    }

);



export const GetSingleOrder = createAsyncThunk("order/getSingleOrder", async (id, thunkAPI) => {

        try {

            const res = await GetSingleOrderAPI(id);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch order"
                }
            );

        }

    }

);



export const CancelOrder = createAsyncThunk("order/cancelOrder", async (id, thunkAPI) => {

        try {

            const res = await CancelOrderAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to cancel order"
                }
            );

        }

    }

);



export const GetAllOrders = createAsyncThunk("order/getAllOrders", async (params, thunkAPI) => {

        try {

            const res = await GetAllOrdersAPI(params);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch all orders"
                }
            );

        }

    }

);


export const UpdateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, orderStatus, paymentStatus }, thunkAPI) => {

        try {

            const res = await UpdateOrderStatusAPI(
                id,
                {
                    orderStatus,
                    paymentStatus
                }
            );

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update order status"
                }
            );

        }

    }
);