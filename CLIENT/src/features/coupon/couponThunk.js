import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    CreateCouponAPI,

    GetAllCouponsAPI,

    ApplyCouponAPI,

    UpdateCouponAPI,

    DeleteCouponAPI

} from "./couponAPI";



export const CreateCoupon = createAsyncThunk("coupon/createCoupon", async (couponData, thunkAPI) => {

        try {

            const res = await CreateCouponAPI(couponData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to create coupon"
                }
            );

        }

    }

);



export const GetAllCoupons = createAsyncThunk("coupon/getAllCoupons", async (_, thunkAPI) => {

        try {

            const res = await GetAllCouponsAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch coupons"
                }
            );

        }

    }

);



export const ApplyCoupon = createAsyncThunk("coupon/applyCoupon", async (couponData, thunkAPI) => {

        try {

            const res = await ApplyCouponAPI(couponData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to apply coupon"
                }
            );

        }

    }

);



export const UpdateCoupon = createAsyncThunk("coupon/updateCoupon", async ({ id, couponData }, thunkAPI) => {

        try {

            const res = await UpdateCouponAPI(
                id,
                couponData
            );

            return {
                ...res.data,
                id,
                couponData
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update coupon"
                }
            );

        }

    }

);



export const DeleteCoupon = createAsyncThunk("coupon/deleteCoupon", async (id, thunkAPI) => {

        try {

            const res = await DeleteCouponAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to delete coupon"
                }
            );

        }

    }

);