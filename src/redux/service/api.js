import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiPath from "../../apiPath";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body) => {  
                let hostname = window.location.hostname;
                hostname = hostname.replace(/^www\./, "");
                hostname = hostname.replace(/^ag\./, "");
                body.website = hostname || "SABAEXCH";
                body.uniqueId = Math.random() * 10000;

                return {
                    url: apiPath.loginUser,
                    method: "POST",
                    body,
                };
            },
        }),
        signupUser: builder.mutation({
            query: (body) => ({
                url: apiPath.signupUser,
                method: "POST",
                body,
            }),
        }),
        refreshToken: builder.mutation({
            query: ({ playerId, oprId, token }) => {
                return {
                    url: 'auth/game/token',
                    method: 'POST',
                    body: {
                        operator_id: oprId,
                        player_id: playerId,
                        current_auth_token: JSON.parse(localStorage.getItem('authToken'))
                    }
                }
            }
        }),
    }),
});

export const { useLoginUserMutation, useSignupUserMutation, useRefreshTokenMutation } = api;