import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";



const authSlice = createSlice({
    name: 'auth',
    initialState:{
        status: false,
        userData: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null // Thêm trường này để kiểm tra trạng thái admin
    },
    reducers:{
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.status = true;
            state.loading = false;
            state.userData = action.payload.userData;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.status = false;
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        },

    }
})

export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions;

export default authSlice.reducer;