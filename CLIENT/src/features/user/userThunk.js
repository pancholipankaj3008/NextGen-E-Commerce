import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    GetAllUsersAPI,

    CreateUserByAdminAPI,

    UpdateUserByAdminAPI,

    DeleteUserAPI,

    BlockUserAPI,

    UnblockUserAPI,

    UserAnalyticsAPI

} from "./userAPI";



export const GetAllUsers = createAsyncThunk("user/getAllUsers", async (_, thunkAPI) => {

        try {

            const res = await GetAllUsersAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to fetch users"
                }
            );

        }

    }

);



export const CreateUserByAdmin = createAsyncThunk("user/createUserByAdmin", async (userData, thunkAPI) => {

        try {

            const res = await CreateUserByAdminAPI(userData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to create user"
                }
            );

        }

    }

);



export const UpdateUserByAdmin = createAsyncThunk("user/updateUserByAdmin", async ({ id, userData }, thunkAPI) => {

        try {

            const res = await UpdateUserByAdminAPI(id, userData);

            return {
                ...res.data,
                id,
                userData
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to update user"
                }
            );

        }

    }

);



export const DeleteUser = createAsyncThunk("user/deleteUser", async (id, thunkAPI) => {

        try {

            const res = await DeleteUserAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to delete user"
                }
            );

        }

    }

);



export const BlockUser = createAsyncThunk("user/blockUser", async (id, thunkAPI) => {

        try {

            const res = await BlockUserAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to block user"
                }
            );

        }

    }

);



export const UnblockUser = createAsyncThunk("user/unblockUser", async (id, thunkAPI) => {

        try {

            const res = await UnblockUserAPI(id);

            return {
                ...res.data,
                id
            };

        }

        catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Unable to unblock user"
                }
            );

        }

    }

);



export const UserAnalytics = createAsyncThunk("user/userAnalytics", async (_, thunkAPI) => {

        try {

            const res = await UserAnalyticsAPI();

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