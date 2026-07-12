import { createSlice } from "@reduxjs/toolkit";

import {

    CreatePayment,

    VerifyPayment,

    GetMyPayments,

    GetSinglePayment,

    GetAllPayments,

    RefundPayment

} from "./paymentThunk";



const initialState = {

    paymentOrder: null,

    payment: null,

    myPayments: [],

    allPayments: [],

    totalPayments: 0,

    totalPages: 0,

    currentPage: 1,

    loading: false,

    paymentLoading: false,

    message: "",

    error: null

};



const paymentSlice = createSlice({

    name: "payment",

    initialState,

    reducers: {

        ClearPaymentMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        ClearPaymentOrder: (state) => {

            state.paymentOrder = null;

        },

        ClearSinglePayment: (state) => {

            state.payment = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Create Payment

            .addCase(CreatePayment.pending, (state) => {

                state.paymentLoading = true;

                state.error = null;

            })

            .addCase(CreatePayment.fulfilled, (state, action) => {

                state.paymentLoading = false;

                state.message = action.payload.message;

                state.paymentOrder =
                    action.payload.paymentOrder ||
                    action.payload.gatewayOrder ||
                    null;

            })

            .addCase(CreatePayment.rejected, (state, action) => {

                state.paymentLoading = false;

                state.error = action.payload?.message;

            })



            // Verify Payment

            .addCase(VerifyPayment.pending, (state) => {

                state.paymentLoading = true;

                state.error = null;

            })

            .addCase(VerifyPayment.fulfilled, (state, action) => {

                state.paymentLoading = false;

                state.message = action.payload.message;

                state.payment =
                    action.payload.payment || null;

                state.paymentOrder = null;

            })

            .addCase(VerifyPayment.rejected, (state, action) => {

                state.paymentLoading = false;

                state.error = action.payload?.message;

            })



            // Get My Payments

            .addCase(GetMyPayments.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetMyPayments.fulfilled, (state, action) => {

                state.loading = false;

                state.myPayments =
                    action.payload.payments || [];

            })

            .addCase(GetMyPayments.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Get Single Payment

            .addCase(GetSinglePayment.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetSinglePayment.fulfilled, (state, action) => {

                state.loading = false;

                state.payment =
                    action.payload.payment || null;

            })

            .addCase(GetSinglePayment.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Get All Payments

            .addCase(GetAllPayments.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllPayments.fulfilled, (state, action) => {

                state.loading = false;

                state.allPayments =
                    action.payload.payments || [];

                state.totalPayments =
                    action.payload.totalPayments ?? 0;

                state.totalPages =
                    action.payload.totalPages ?? 0;

                state.currentPage =
                    action.payload.currentPage ?? 1;

            })

            .addCase(GetAllPayments.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Refund Payment

            .addCase(RefundPayment.pending, (state) => {

                state.paymentLoading = true;

                state.error = null;

            })

            .addCase(RefundPayment.fulfilled, (state, action) => {

                state.paymentLoading = false;

                state.message = action.payload.message;

                let index = state.allPayments.findIndex(
                    (payment) =>
                        payment._id === action.payload.id
                );

                if (index !== -1) {

                    if (action.payload.payment) {

                        state.allPayments[index] =
                            action.payload.payment;

                    }

                    else {

                        state.allPayments[index].status =
                            "refunded";

                    }

                }

                if (
                    state.payment?._id ===
                    action.payload.id
                ) {

                    if (action.payload.payment) {

                        state.payment =
                            action.payload.payment;

                    }

                    else {

                        state.payment.status =
                            "refunded";

                    }

                }

            })

            .addCase(RefundPayment.rejected, (state, action) => {

                state.paymentLoading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearPaymentMessage,

    ClearPaymentOrder,

    ClearSinglePayment

} = paymentSlice.actions;



export default paymentSlice.reducer;