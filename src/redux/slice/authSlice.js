// src/redux/slice/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    username: null,
    token: null,
    refresh_token: null,
    isLogin: false,
    totalCoins: 0,
    referral_code : ''
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, refresh_token, username, userId, totalCoins, referral_code  } = action.payload;

            state.userId = userId;
            state.username = username;
            state.token = token;
            state.refresh_token = refresh_token;
            state.isLogin = true;
            state.totalCoins = totalCoins,
            state.referral_code = referral_code

            // localStorage save
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    userId,
                    username,
                    token,
                    refresh_token,
                    isLogin: true,
                    totalCoins,
                    referral_code
                })
            );
        },
        logout: (state) => {
            state.userId = null;
            state.username = null;
            state.token = null;
            state.refresh_token = null;
            state.isLogin = false;
            localStorage.removeItem("auth");
        },
        loadUserFromStorage: (state) => {
            const saved = localStorage.getItem("auth");
            if (saved) {
                const authData = JSON.parse(saved);
                state.userId = authData.userId;
                state.username = authData.username;
                state.token = authData.token;
                state.refresh_token = authData.refresh_token;
                state.isLogin = authData.isLogin;
                state.totalCoins = authData.totalCoins;
                state.referral_code = authData.referral_code;
            }
        },
    },
});

export const { setCredentials, logout, loadUserFromStorage } =
    authSlice.actions;
export default authSlice.reducer;
