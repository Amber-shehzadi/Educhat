import { apiSlice } from "../features/api/apiSlice";

export const messageAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allMessages: builder.query({
      query: ({ recipient }) => ({
        url: `/get-messages`,
        method: "POST",
        body: { recipient },
        credentials: "include" as const,
      }),
    }),
    getAllContacts: builder.query({
      query: () => ({
        url: `/get-dm-contacts`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    uploadFile: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/upload-file",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useLazyAllMessagesQuery,
  useLazyGetAllContactsQuery,
  useUploadFileMutation,
} = messageAPI;
