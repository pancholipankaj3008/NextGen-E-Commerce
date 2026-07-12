import { createSlice } from "@reduxjs/toolkit";

import {

    CreateReview,

    GetProductReviews,

    UpdateReview,

    DeleteReview

} from "./reviewThunk";



const initialState = {

    reviews: [],

    totalReviews: 0,

    averageRating: 0,

    loading: false,

    actionLoading: false,

    message: "",

    error: null

};



const reviewSlice = createSlice({

    name: "review",

    initialState,

    reducers: {

        ClearReviewMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        ClearReviews: (state) => {

            state.reviews = [];

            state.totalReviews = 0;

            state.averageRating = 0;

        }

    },

    extraReducers: (builder) => {

        builder



            // Get Product Reviews

            .addCase(GetProductReviews.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetProductReviews.fulfilled, (state, action) => {

                state.loading = false;

                state.reviews =
                    action.payload.reviews || [];

                state.totalReviews =
                    action.payload.totalReviews ?? 0;

                state.averageRating =
                    action.payload.averageRating ?? 0;

            })

            .addCase(GetProductReviews.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Create Review

            .addCase(CreateReview.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(CreateReview.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                if (action.payload.review) {

                    state.reviews.unshift(
                        action.payload.review
                    );

                    state.totalReviews += 1;

                }

                if (
                    action.payload.averageRating !== undefined
                ) {

                    state.averageRating =
                        action.payload.averageRating;

                }

            })

            .addCase(CreateReview.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Update Review

            .addCase(UpdateReview.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(UpdateReview.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                if (action.payload.review) {

                    let index = state.reviews.findIndex(
                        (review) =>
                            review._id ===
                            action.payload.review._id
                    );

                    if (index !== -1) {

                        state.reviews[index] =
                            action.payload.review;

                    }

                }

                if (
                    action.payload.averageRating !== undefined
                ) {

                    state.averageRating =
                        action.payload.averageRating;

                }

            })

            .addCase(UpdateReview.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            })



            // Delete Review

            .addCase(DeleteReview.pending, (state) => {

                state.actionLoading = true;

                state.error = null;

            })

            .addCase(DeleteReview.fulfilled, (state, action) => {

                state.actionLoading = false;

                state.message = action.payload.message;

                state.reviews = state.reviews.filter(
                    (review) =>
                        review._id !== action.payload.id
                );

                state.totalReviews = Math.max(
                    0,
                    state.totalReviews - 1
                );

                if (
                    action.payload.averageRating !== undefined
                ) {

                    state.averageRating =
                        action.payload.averageRating;

                }

            })

            .addCase(DeleteReview.rejected, (state, action) => {

                state.actionLoading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearReviewMessage,

    ClearReviews

} = reviewSlice.actions;



export default reviewSlice.reducer;