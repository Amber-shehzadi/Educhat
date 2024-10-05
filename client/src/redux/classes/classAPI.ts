import { apiSlice } from "../features/api/apiSlice";

export const messageAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createClass: builder.mutation({
      query: ({ name, semester, description, coordinator }) => ({
        url: `/create-class`,
        method: "POST",
        body: { name, semester, description, coordinator },
        credentials: "include" as const,
      }),
    }),

    updateClass: builder.mutation({
      query: ({ name, semester, description, key }) => ({
        url: `/class/${key}`,
        method: "PUT",
        body: { name, semester, description },
        credentials: "include" as const,
      }),
    }),

    deleteClass: builder.mutation({
      query: ({ key }) => ({
        url: `/class/${key}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    getAllClasses: builder.query({
      query: () => ({
        url: `/classes`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateClassMutation,
  useLazyGetAllClassesQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = messageAPI;
