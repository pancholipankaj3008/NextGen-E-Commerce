import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


const initialState = {

  dashboard: null,

  userAnalytics: null,

  productAnalytics: null,

  users: [],

  coupons: [],

  orders: [],

  loading: false,

  error: null,

};


const adminSlice = createSlice({

  name: "admin",

  initialState,

  reducers: {

    ClearAdminError: (state) => {
      state.error = null;
    },

    ResetAdminState: () => initialState,

  },


  extraReducers: (builder) => {

    builder


      // ================= PENDING =================

      .addMatcher(

        (action) =>
          action.type.startsWith("admin/") &&
          action.type.endsWith("/pending"),

        (state) => {

          state.loading = true;

          state.error = null;

        }

      )


      // ================= FULFILLED =================

      .addMatcher(

        (action) =>
          action.type.startsWith("admin/") &&
          action.type.endsWith("/fulfilled"),

        (state, action) => {

          state.loading = false;


          // Dashboard

          if (action.payload?.dashboard) {
            state.dashboard =
              action.payload.dashboard;
          }

          if (action.payload?.stats) {
            state.dashboard =
              action.payload.stats;
          }


          // Analytics

          if (action.payload?.userAnalytics) {

            state.userAnalytics =
              action.payload.userAnalytics;

          }

          if (action.payload?.productAnalytics) {

            state.productAnalytics =
              action.payload.productAnalytics;

          }


          // Users

          if (action.payload?.users) {

            state.users =
              action.payload.users;

          }


          if (action.payload?.user) {

            const user =
              action.payload.user;

            const index =
              state.users.findIndex(
                (item) =>
                  item._id === user._id
              );

            if (index !== -1) {

              state.users[index] = user;

            } else {

              state.users.unshift(user);

            }

          }


          // Coupons

          if (action.payload?.coupons) {

            state.coupons =
              action.payload.coupons;

          }


          if (action.payload?.coupon) {

            const coupon =
              action.payload.coupon;

            state.coupons = [

              coupon,

              ...state.coupons.filter(
                (item) =>
                  item._id !== coupon._id
              ),

            ];

          }


          // Orders

          if (action.payload?.orders) {

            state.orders =
              action.payload.orders;

          }


          if (action.payload?.order) {

            const order =
              action.payload.order;

            const index =
              state.orders.findIndex(
                (item) =>
                  item._id === order._id
              );

            if (index !== -1) {

              state.orders[index] =
                order;

            } else {

              state.orders.unshift(order);

            }

          }


          // Delete User

          if (
            action.type.includes("deleteUser") &&
            action.meta?.arg
          ) {

            state.users =
              state.users.filter(
                (item) =>
                  item._id !== action.meta.arg
              );

          }


          // Delete Coupon

          if (
            action.type.includes("deleteCoupon") &&
            action.meta?.arg
          ) {

            state.coupons =
              state.coupons.filter(
                (item) =>
                  item._id !== action.meta.arg
              );

          }


          // Success Toast

          if (
            action.payload?.message &&
            !action.type.includes("dashboard")
          ) {

            toast.success(
              action.payload.message
            );

          }

        }

      )


      // ================= REJECTED =================

      .addMatcher(

        (action) =>
          action.type.startsWith("admin/") &&
          action.type.endsWith("/rejected"),

        (state, action) => {

          state.loading = false;

          state.error =
            action.payload?.message ||
            "Something went wrong";

          toast.error(
            action.payload?.message ||
            "Something went wrong"
          );

        }

      );

  },

});


export const {

  ClearAdminError,

  ResetAdminState,

} = adminSlice.actions;


export default adminSlice.reducer;