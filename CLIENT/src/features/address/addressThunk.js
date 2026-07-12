import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    AddAddressAPI,

    UpdateAddressAPI,

    RemoveAddressAPI

} from "./addressAPI";



export const AddAddress = createAsyncThunk("address/addAddress", async (addressData, thunkAPI) => {

        try {

            const res = await AddAddressAPI(addressData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to add address"
                }
            );

        }

    }

);



export const UpdateAddress = createAsyncThunk("address/updateAddress", async ({ addressId, addressData }, thunkAPI) => {

        try {

            const res = await UpdateAddressAPI(
                addressId,
                addressData
            );

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update address"
                }
            );

        }

    }

);



export const RemoveAddress = createAsyncThunk("address/removeAddress", async (addressId, thunkAPI) => {

        try {

            const res = await RemoveAddressAPI(addressId);

            return {
                ...res.data,
                addressId
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to remove address"
                }
            );

        }

    }

);