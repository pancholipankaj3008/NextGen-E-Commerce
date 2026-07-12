import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    CreateReviewAPI,

    GetProductReviewsAPI,

    UpdateReviewAPI,

    DeleteReviewAPI

} from "./reviewAPI";



export const CreateReview = createAsyncThunk("review/createReview", async (reviewData, thunkAPI) => {

        try {

            const res = await CreateReviewAPI(reviewData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to create review"
                }
            );

        }

    }

);



export const GetProductReviews = createAsyncThunk("review/getProductReviews", async (productId, thunkAPI) => {

        try {

            const res = await GetProductReviewsAPI(productId);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch reviews"
                }
            );

        }

    }

);



export const UpdateReview = createAsyncThunk("review/updateReview", async ({ id, reviewData }, thunkAPI) => {

        try {

            const res = await UpdateReviewAPI(
                id,
                reviewData
            );

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update review"
                }
            );

        }

    }

);



export const DeleteReview = createAsyncThunk("review/deleteReview", async (id, thunkAPI) => {

        try {

            const res = await DeleteReviewAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to delete review"
                }
            );

        }

    }

);