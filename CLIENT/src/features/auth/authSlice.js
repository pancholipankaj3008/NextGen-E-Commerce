import { createSlice } from "@reduxjs/toolkit";

import {

    SignUp,

    Login,

    Logout,

    ForgotPassword,

    ResetPassword,

    GetProfile,

    UpdateProfile,

    ChangePassword

} from "./authThunk";



const initialState = {

    loading: false,

    success: false,

    message: "",

    user: null,

    isAuthenticated: false,

    error: null

};



const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        ClearMessage: (state) => {

            state.message = "";

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Signup

            .addCase(SignUp.pending, (state) => {

                state.loading = true;

            })

            .addCase(SignUp.fulfilled, (state, action) => {

                state.loading = false;

                state.success = action.payload.success;

                state.message = action.payload.message;

            })

            .addCase(SignUp.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload.message;

            })



            // Login

            .addCase(Login.pending, (state) => {

                state.loading = true;

            })

            .addCase(Login.fulfilled, (state, action) => {

                state.loading = false;

                state.success = action.payload.success;

                state.message = action.payload.message;

                state.isAuthenticated = true;

            })

            .addCase(Login.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload.message;

            })



            // Logout

            .addCase(Logout.fulfilled, (state, action) => {

                state.message = action.payload.message;

                state.user = null;

                state.isAuthenticated = false;

            })



            // Forgot Password
.addCase(ForgotPassword.pending, (state) => {

    state.loading = true;
    state.error = null;

})

.addCase(ForgotPassword.fulfilled, (state, action) => {

    state.loading = false;
    state.message = action.payload.message;

})

.addCase(ForgotPassword.rejected, (state, action) => {

    state.loading = false;
    state.error = action.payload?.message;

})



            // Reset Password

            .addCase(ResetPassword.pending, (state) => {

    state.loading = true;
    state.error = null;

})

.addCase(ResetPassword.fulfilled, (state, action) => {

    state.loading = false;
    state.message = action.payload.message;

})

.addCase(ResetPassword.rejected, (state, action) => {

    state.loading = false;
    state.error = action.payload?.message;

})

            //Get Profile

            .addCase(GetProfile.pending, (state) => {

                state.loading = true;

            })

            .addCase(GetProfile.fulfilled, (state, action) => {

                state.loading = false;

                state.success = true;

                state.user = action.payload.user;

                state.isAuthenticated = true;

            })

            .addCase(GetProfile.rejected, (state, action) => {

                state.loading = false;

                state.user = null;

                state.isAuthenticated = false;

                state.error = action.payload?.message;

            })

            .addCase(UpdateProfile.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UpdateProfile.fulfilled, (state, action) => {

                state.loading = false;

                state.user = action.payload.user || action.payload;

                state.message = action.payload.message || "Profile updated";

                state.isAuthenticated = true;

            })

            .addCase(UpdateProfile.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })

            .addCase(ChangePassword.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(ChangePassword.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

            })

            .addCase(ChangePassword.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearMessage

} = authSlice.actions;



export default authSlice.reducer;
