import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  GetUserAnalyticsAPI,
  GetProductAnalyticsAPI,

  GetAdminUsersAPI,
  CreateAdminUserAPI,
  UpdateAdminUserAPI,
  DeleteAdminUserAPI,
  BlockAdminUserAPI,
  UnblockAdminUserAPI,

  GetAdminCouponsAPI,
  CreateAdminCouponAPI,
  UpdateAdminCouponAPI,
  DeleteAdminCouponAPI,

  CreateAdminProductAPI,
  UpdateAdminProductAPI,
  DeleteAdminProductAPI,

  GetAdminOrdersAPI,
  UpdateAdminOrderStatusAPI,
} from "./adminAPI";


const rejectError = (error, thunkAPI, fallback) => {
  return thunkAPI.rejectWithValue(
    error.response?.data || {
      message: fallback,
    }
  );
};


// ======================================================
// DASHBOARD
// ======================================================

export const fetchDashboard = createAsyncThunk(
  "admin/dashboard",

  async (_, thunkAPI) => {
    try {
      const role =
        thunkAPI.getState().auth.user?.role;

      const payload = {};

      if (role === "admin") {
        const users =
          await GetUserAnalyticsAPI();

        payload.userAnalytics =
          users.data.analytics;
      }

      if (
        role === "admin" ||
        role === "inventory staff"
      ) {
        const products =
          await GetProductAnalyticsAPI();

        payload.productAnalytics =
          products.data.analytics;
      }

      return payload;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to load dashboard"
      );
    }
  }
);


// ======================================================
// USERS
// ======================================================

export const fetchAdminUsers = createAsyncThunk(
  "admin/users",

  async (_, thunkAPI) => {
    try {
      const res =
        await GetAdminUsersAPI();

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to load users"
      );
    }
  }
);


export const createAdminUser = createAsyncThunk(
  "admin/createUser",

  async (payload, thunkAPI) => {
    try {
      const res =
        await CreateAdminUserAPI(payload);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to create user"
      );
    }
  }
);


export const updateAdminUser = createAsyncThunk(
  "admin/updateUser",

  async ({ id, data }, thunkAPI) => {
    try {
      const res =
        await UpdateAdminUserAPI(id, data);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to update user"
      );
    }
  }
);


export const deleteAdminUser = createAsyncThunk(
  "admin/deleteUser",

  async (id, thunkAPI) => {
    try {
      const res =
        await DeleteAdminUserAPI(id);

      return {
        ...res.data,
        id,
      };

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to delete user"
      );
    }
  }
);


export const blockAdminUser = createAsyncThunk(
  "admin/blockUser",

  async (id, thunkAPI) => {
    try {
      const res =
        await BlockAdminUserAPI(id);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to block user"
      );
    }
  }
);


export const unblockAdminUser = createAsyncThunk(
  "admin/unblockUser",

  async (id, thunkAPI) => {
    try {
      const res =
        await UnblockAdminUserAPI(id);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to unblock user"
      );
    }
  }
);


// ======================================================
// COUPONS
// ======================================================

export const fetchCoupons = createAsyncThunk(
  "admin/coupons",

  async (_, thunkAPI) => {
    try {
      const res =
        await GetAdminCouponsAPI();

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to load coupons"
      );
    }
  }
);


export const createCoupon = createAsyncThunk(
  "admin/createCoupon",

  async (payload, thunkAPI) => {
    try {
      const res =
        await CreateAdminCouponAPI(payload);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to create coupon"
      );
    }
  }
);


export const updateCoupon = createAsyncThunk(
  "admin/updateCoupon",

  async ({ id, data }, thunkAPI) => {
    try {
      const res =
        await UpdateAdminCouponAPI(id, data);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to update coupon"
      );
    }
  }
);


export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",

  async (id, thunkAPI) => {
    try {
      const res =
        await DeleteAdminCouponAPI(id);

      return {
        ...res.data,
        id,
      };

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to delete coupon"
      );
    }
  }
);


// ======================================================
// PRODUCTS
// ======================================================

export const createProduct = createAsyncThunk(
  "admin/createProduct",

  async (formData, thunkAPI) => {
    try {
      const res =
        await CreateAdminProductAPI(formData);

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to create product"
      );
    }
  }
);


export const updateProduct = createAsyncThunk(
  "admin/updateProduct",

  async ({ id, formData }, thunkAPI) => {
    try {
      const res =
        await UpdateAdminProductAPI(
          id,
          formData
        );

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to update product"
      );
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",

  async (id, thunkAPI) => {
    try {
      const res =
        await DeleteAdminProductAPI(id);

      return {
        ...res.data,
        id,
      };

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to delete product"
      );
    }
  }
);


// ======================================================
// ORDERS
// ======================================================

export const fetchAdminOrders = createAsyncThunk(
  "admin/orders",

  async (_, thunkAPI) => {
    try {
      const res =
        await GetAdminOrdersAPI();

      return res.data;

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to load orders"
      );
    }
  }
);


export const updateAdminOrderStatus = createAsyncThunk(
  "admin/updateOrder",

  async ({ id, data }, thunkAPI) => {
    try {
      const res =
        await UpdateAdminOrderStatusAPI(
          id,
          data
        );

      return {
        ...res.data,
        id,
      };

    } catch (error) {
      return rejectError(
        error,
        thunkAPI,
        "Unable to update order"
      );
    }
  }
);