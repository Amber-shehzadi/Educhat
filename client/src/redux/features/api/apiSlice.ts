import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { startLoading, stopLoading, userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URI,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: (data) => ({
        url: "refresh-token",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: (data) => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(startLoading());
          dispatch(
            userLoggedIn({
              accessToken: result.data.token,
              user: result.data.user,
            })
          );
          dispatch(stopLoading());
        } catch (err: any) {
          dispatch(stopLoading());
          console.error(err);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLazyLoadUserQuery } = apiSlice;
