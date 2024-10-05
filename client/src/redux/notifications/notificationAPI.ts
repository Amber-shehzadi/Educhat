import { apiSlice } from "../features/api/apiSlice";

export const notificationAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: () => ({
        url: `/get-user-notifications`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useLazyGetUserNotificationsQuery } = notificationAPI;
