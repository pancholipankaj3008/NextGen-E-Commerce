import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    SignUpAPI,

    LoginAPI,

    LogoutAPI,

    ForgotPasswordAPI,

    ResetPasswordAPI,

    GetProfileAPI,

    UpdateProfileAPI,

    ChangePasswordAPI

} from "./authAPI";



export const SignUp = createAsyncThunk("auth/signup", async (userData, thunkAPI) => {

        try {

            const res = await SignUpAPI(userData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Signup failed" });

        }

    }

);



export const Login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {

        try {

            const res = await LoginAPI(userData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Login failed" });

        }

    }

);


export const GetProfile = createAsyncThunk("auth/getProfile", async (_, thunkAPI) => {

        try {

            const res = await GetProfileAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Unable to fetch profile" });

        }

    }

);


export const Logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {

        try {

            const res = await LogoutAPI();

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Logout failed" });

        }

    }

);



export const ForgotPassword = createAsyncThunk("auth/forgotPassword", async (email, thunkAPI) => {

        try {

            const res = await ForgotPasswordAPI(email);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Unable to send reset email" });

        }

    }

);



export const ResetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, password }, thunkAPI) => {
    try {

      const res = await ResetPasswordAPI(
        resetToken,
        password
      );

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Unable to reset password",
        }
      );

    }
  }
);

export const UpdateProfile = createAsyncThunk("auth/updateProfile", async (userData, thunkAPI) => {

        try {

            const res = await UpdateProfileAPI(userData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Unable to update profile" });

        }

    }

);

export const ChangePassword = createAsyncThunk("auth/changePassword", async (passwordData, thunkAPI) => {

        try {

            const res = await ChangePasswordAPI(passwordData);

            return res.data;

        }

        catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || { message: "Unable to change password" });

        }

    }

);
