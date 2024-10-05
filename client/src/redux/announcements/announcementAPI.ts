// features/api/announcementApiSlice.ts
import { apiSlice } from "../features/api/apiSlice";

export const announcementAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create an announcement
    createAnnouncement: builder.mutation({
      query: ({ title, description }) => ({
        url: "/announcements",
        method: "POST",
        body: {
          title,
          description,
        },
        credentials: "include" as const,
      }),
    }),

    // Get paginated announcements
    getPaginatedAnnouncements: builder.query({
      query: ({ limit = 20, offset = 0 }) => ({
        url: "/announcements",
        method: "GET",
        params: {
          limit,
          offset,
        },
        credentials: "include" as const,
      }),
    }),

    // Update an announcement
    updateAnnouncement: builder.mutation({
      query: ({ id, title, description }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: {
          title,
          description,
        },
        credentials: "include" as const,
      }),
    }),

    // Delete an announcement (soft delete)
    deleteAnnouncement: builder.mutation({
      query: ({ id }) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useLazyGetPaginatedAnnouncementsQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementAPI;
