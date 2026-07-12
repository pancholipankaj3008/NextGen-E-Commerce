import { createSlice } from "@reduxjs/toolkit";

import {

    AddAddress,

    UpdateAddress,

    RemoveAddress

} from "./addressThunk";



const initialState = {

    addresses: [],

    loading: false,

    message: "",

    error: null

};



const addressSlice = createSlice({

    name: "address",

    initialState,

    reducers: {

        SetAddresses: (state, action) => {

            state.addresses = action.payload;

        },

        ClearAddressMessage: (state) => {

            state.message = "";

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Add Address

            .addCase(AddAddress.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(AddAddress.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.addresses.push(
                    action.payload.address
                );

            })

            .addCase(AddAddress.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Update Address

            .addCase(UpdateAddress.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UpdateAddress.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                let index = state.addresses.findIndex(
                    (address) =>
                        address._id === action.payload.address._id
                );

                if (index !== -1) {

                    state.addresses[index] =
                        action.payload.address;

                }

            })

            .addCase(UpdateAddress.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Remove Address

            .addCase(RemoveAddress.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(RemoveAddress.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.addresses = state.addresses.filter(
                    (address) =>
                        address._id !== action.payload.addressId
                );

            })

            .addCase(RemoveAddress.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    SetAddresses,

    ClearAddressMessage

} = addressSlice.actions;



export default addressSlice.reducer;