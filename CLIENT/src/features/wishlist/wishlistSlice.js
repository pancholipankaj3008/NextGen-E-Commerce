import { createSlice } from "@reduxjs/toolkit";

import {

  GetWishlist,

  AddToWishlist,

  RemoveWishlist

} from "./wishlistThunk";



const initialState = {

  wishlist: [],

  loading: false,

  message: "",

  error: null

};



const wishlistSlice = createSlice({

  name: "wishlist",

  initialState,

  reducers: {

    ClearWishlistMessage: (state) => {

      state.message = "";

      state.error = null;

    },

    ClearWishlist: (state) => {

      state.wishlist = [];

    }

  },

  extraReducers: (builder) => {

    builder



      // Get Wishlist

      .addCase(GetWishlist.pending, (state) => {

        state.loading = true;

        state.error = null;

      })

      .addCase(GetWishlist.fulfilled, (state, action) => {

        state.loading = false;

        state.wishlist = action.payload.wishlist;

      })

      .addCase(GetWishlist.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload?.message;

      })



      // Add To Wishlist

      .addCase(AddToWishlist.pending, (state) => {

        state.loading = true;

        state.error = null;

      })

      .addCase(AddToWishlist.fulfilled, (state, action) => {

        state.loading = false;

        state.message = action.payload.message;

        if (action.payload.product) {

          state.wishlist.push(
            action.payload.product
          );

        }

      })

      .addCase(AddToWishlist.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload?.message;

      })



      // Remove Wishlist

      .addCase(RemoveWishlist.pending, (state) => {

        state.loading = true;

        state.error = null;

      })

      .addCase(RemoveWishlist.fulfilled, (state, action) => {

        state.loading = false;

        state.message = action.payload.message;

        state.wishlist = state.wishlist.filter(
          (item) =>
            String(
              item.product?._id ||
              item.product ||
              item._id
            ) !== String(
              action.payload.productId
            )
        );

      })

      .addCase(RemoveWishlist.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload?.message;

      });

  }

});



export const {

  ClearWishlistMessage,

  ClearWishlist

} = wishlistSlice.actions;



export default wishlistSlice.reducer;