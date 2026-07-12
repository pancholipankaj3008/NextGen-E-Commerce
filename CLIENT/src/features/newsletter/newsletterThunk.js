import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    SubscribeNewsletterAPI,

    UnsubscribeNewsletterAPI,

    GetAllSubscribersAPI,

    DeleteSubscriberAPI

} from "./newsletterAPI";



export const SubscribeNewsletter = createAsyncThunk("newsletter/subscribeNewsletter", async (email, thunkAPI) => {

        try {

            const res = await SubscribeNewsletterAPI(email);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to subscribe newsletter"
                }
            );

        }

    }

);



export const UnsubscribeNewsletter = createAsyncThunk("newsletter/unsubscribeNewsletter", async (email, thunkAPI) => {

        try {

            const res = await UnsubscribeNewsletterAPI(email);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to unsubscribe newsletter"
                }
            );

        }

    }

);



export const GetAllSubscribers = createAsyncThunk("newsletter/getAllSubscribers", async (_, thunkAPI) => {

        try {

            const res = await GetAllSubscribersAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch subscribers"
                }
            );

        }

    }

);



export const DeleteSubscriber = createAsyncThunk("newsletter/deleteSubscriber", async (id, thunkAPI) => {

        try {

            const res = await DeleteSubscriberAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to delete subscriber"
                }
            );

        }

    }

);