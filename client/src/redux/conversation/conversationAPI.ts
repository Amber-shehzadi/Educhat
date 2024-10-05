import { apiSlice } from "../features/api/apiSlice";

export const conversationAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChannel: builder.mutation({
      query: ({ name, members }) => ({
        url: "/create-channel",
        method: "POST",
        body: { name, members },
        credentials: "include" as const,
      }),
    }),
    getUserChannels: builder.query({
      query: () => ({
        url: "/get-user-channel",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getChannelMessages: builder.query({
      query: ({ channelId }) => ({
        url: `/get-channel-messages/${channelId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateChannelMutation,
  useLazyGetUserChannelsQuery,
  useLazyGetChannelMessagesQuery,
} = conversationAPI;
