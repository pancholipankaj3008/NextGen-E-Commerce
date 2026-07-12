import { createSlice } from "@reduxjs/toolkit";

import {

    GetAllUsers,

    CreateUserByAdmin,

    UpdateUserByAdmin,

    DeleteUser,

    BlockUser,

    UnblockUser,

    UserAnalytics

} from "./userThunk";



const initialState = {

    loading: false,

    users: [],

    analytics: null,

    message: "",

    error: null

};



const userSlice = createSlice({

    name: "user",

    initialState,

    reducers: {

        ClearUserMessage: (state) => {

            state.message = "";

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder



            // Get All Users

            .addCase(GetAllUsers.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllUsers.fulfilled, (state, action) => {

                state.loading = false;

                state.users = action.payload.users;

            })

            .addCase(GetAllUsers.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Create User By Admin

            .addCase(CreateUserByAdmin.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(CreateUserByAdmin.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

            })

            .addCase(CreateUserByAdmin.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Update User By Admin

            .addCase(UpdateUserByAdmin.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UpdateUserByAdmin.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                let index = state.users.findIndex(
                    (user) => user._id === action.payload.id
                );

                if (index !== -1) {

                    state.users[index] = {

                        ...state.users[index],

                        ...action.payload.userData

                    };

                }

            })

            .addCase(UpdateUserByAdmin.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Delete User

            .addCase(DeleteUser.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(DeleteUser.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.users = state.users.filter(
                    (user) => user._id !== action.payload.id
                );

            })

            .addCase(DeleteUser.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Block User

            .addCase(BlockUser.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(BlockUser.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                let user = state.users.find(
                    (user) => user._id === action.payload.id
                );

                if (user) {

                    user.isBlocked = true;

                }

            })

            .addCase(BlockUser.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Unblock User

            .addCase(UnblockUser.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UnblockUser.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                let user = state.users.find(
                    (user) => user._id === action.payload.id
                );

                if (user) {

                    user.isBlocked = false;

                }

            })

            .addCase(UnblockUser.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // User Analytics

            .addCase(UserAnalytics.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UserAnalytics.fulfilled, (state, action) => {

                state.loading = false;

                state.analytics = action.payload.analytics;

            })

            .addCase(UserAnalytics.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearUserMessage

} = userSlice.actions;



export default userSlice.reducer;