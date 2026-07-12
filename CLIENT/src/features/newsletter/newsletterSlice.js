import { createSlice } from "@reduxjs/toolkit";

import {

    SubscribeNewsletter,

    UnsubscribeNewsletter,

    GetAllSubscribers,

    DeleteSubscriber

} from "./newsletterThunk";



const initialState = {

    subscribers: [],

    totalSubscribers: 0,

    loading: false,

    subscribeLoading: false,

    message: "",

    error: null

};



const newsletterSlice = createSlice({

    name: "newsletter",

    initialState,

    reducers: {

        ClearNewsletterMessage: (state) => {

            state.message = "";

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Subscribe Newsletter

            .addCase(SubscribeNewsletter.pending, (state) => {

                state.subscribeLoading = true;

                state.error = null;

            })

            .addCase(SubscribeNewsletter.fulfilled, (state, action) => {

                state.subscribeLoading = false;

                state.message = action.payload.message;

            })

            .addCase(SubscribeNewsletter.rejected, (state, action) => {

                state.subscribeLoading = false;

                state.error = action.payload?.message;

            })



            // Unsubscribe Newsletter

            .addCase(UnsubscribeNewsletter.pending, (state) => {

                state.subscribeLoading = true;

                state.error = null;

            })

            .addCase(UnsubscribeNewsletter.fulfilled, (state, action) => {

                state.subscribeLoading = false;

                state.message = action.payload.message;

            })

            .addCase(UnsubscribeNewsletter.rejected, (state, action) => {

                state.subscribeLoading = false;

                state.error = action.payload?.message;

            })



            // Get All Subscribers

            .addCase(GetAllSubscribers.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllSubscribers.fulfilled, (state, action) => {

                state.loading = false;

                state.subscribers =
                    action.payload.subscribers || [];

                state.totalSubscribers =
                    action.payload.totalSubscribers ??
                    action.payload.subscribers?.length ??
                    0;

            })

            .addCase(GetAllSubscribers.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Delete Subscriber

            .addCase(DeleteSubscriber.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(DeleteSubscriber.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.subscribers = state.subscribers.filter(
                    (subscriber) =>
                        subscriber._id !== action.payload.id
                );

                state.totalSubscribers = Math.max(
                    0,
                    state.totalSubscribers - 1
                );

            })

            .addCase(DeleteSubscriber.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearNewsletterMessage

} = newsletterSlice.actions;



export default newsletterSlice.reducer;