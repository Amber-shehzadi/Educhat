import { apiSlice } from "../features/api/apiSlice";

export const eventAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: ({
        title,
        description,
        endDate,
        allDay,
        startDate,
        isVideoMeeting,
      }) => ({
        url: `/create-event`,
        method: "POST",
        body: {
          title,
          description,
          allDay,
          end: endDate,
          start: startDate,
          isVideoMeeting,
        },
        credentials: "include" as const,
      }),
    }),

    getUserEvents: builder.query({
      query: ({ end, start }) => ({
        url: `/user-events`,
        method: "POST",
        body: {
          end,
          start,
        },
        credentials: "include" as const,
      }),
    }),

    updateUserEvent: builder.mutation({
      query: ({
        id,
        title,
        description,
        allDay,
        endDate,
        startDate,
        isVideoMeeting,
      }) => ({
        url: `/event/${id}`,
        method: "PUT",
        body: {
          title,
          description,
          allDay,
          end: endDate,
          start: startDate,
          isVideoMeeting,
        },
        credentials: "include" as const,
      }),
    }),

    drageUserEvent: builder.mutation({
      query: ({ id, allDay, endDate, startDate }) => ({
        url: `/dreg-event/${id}`,
        method: "PUT",
        body: {
          end: endDate,
          start: startDate,
          allDay,
        },
        credentials: "include" as const,
      }),
    }),

    deleteUserEvent: builder.mutation({
      query: ({ id }) => ({
        url: `/delete-event/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateEventMutation,
  useLazyGetUserEventsQuery,
  useUpdateUserEventMutation,
  useDeleteUserEventMutation,
  useDrageUserEventMutation,
} = eventAPI;
