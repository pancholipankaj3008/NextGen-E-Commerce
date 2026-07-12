import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    CreatePaymentAPI,

    VerifyPaymentAPI,

    GetMyPaymentsAPI,

    GetSinglePaymentAPI,

    GetAllPaymentsAPI,

    RefundPaymentAPI

} from "./paymentAPI";



export const CreatePayment = createAsyncThunk("payment/createPayment", async (paymentData, thunkAPI) => {

        try {

            const res = await CreatePaymentAPI(paymentData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to create payment"
                }
            );

        }

    }

);



export const VerifyPayment = createAsyncThunk("payment/verifyPayment", async (paymentData, thunkAPI) => {

        try {

            const res = await VerifyPaymentAPI(paymentData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Payment verification failed"
                }
            );

        }

    }

);



export const GetMyPayments = createAsyncThunk("payment/getMyPayments", async (_, thunkAPI) => {

        try {

            const res = await GetMyPaymentsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch payments"
                }
            );

        }

    }

);



export const GetSinglePayment = createAsyncThunk("payment/getSinglePayment", async (id, thunkAPI) => {

        try {

            const res = await GetSinglePaymentAPI(id);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch payment"
                }
            );

        }

    }

);



export const GetAllPayments = createAsyncThunk("payment/getAllPayments", async (params, thunkAPI) => {

        try {

            const res = await GetAllPaymentsAPI(params);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch all payments"
                }
            );

        }

    }

);



export const RefundPayment = createAsyncThunk("payment/refundPayment", async (id, thunkAPI) => {

        try {

            const res = await RefundPaymentAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to refund payment"
                }
            );

        }

    }

);