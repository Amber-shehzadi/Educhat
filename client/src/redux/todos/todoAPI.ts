import { apiSlice } from "../features/api/apiSlice";

export const todoAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTodo: builder.mutation({
      query: ({ title, description, endDate, startDate }) => ({
        url: `/create-todo`,
        method: "POST",
        body: { title, description, endDate, startDate },
        credentials: "include" as const,
      }),
    }),

    getUserTodos: builder.query({
      query: () => ({
        url: `/get-user-todos`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getUserCalendarTodos: builder.query({
      query: ({ end, start }) => ({
        url: `/get-calendar-todos`,
        method: "POST",
        body: { end, start },
        credentials: "include" as const,
      }),
    }),

    updateTodoStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-todo-status/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include" as const,
      }),
    }),
    drageUserTodo: builder.mutation({
      query: ({ id, endDate, startDate }) => ({
        url: `/drag-todo/${id}`,
        method: "PUT",
        body: {
          end: endDate,
          start: startDate,
        },
        credentials: "include" as const,
      }),
    }),

    updateTodo: builder.mutation({
      query: ({ id, title, description, endDate, startDate }) => ({
        url: `/update-todo/${id}`,
        method: "PUT",
        body: { title, description, endDate, startDate },
        credentials: "include" as const,
      }),
    }),

    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/delete-todo/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    addComment: builder.mutation({
      query: ({ commentText, id }) => ({
        url: `/add-comment/${id}`,
        method: "PUT",
        body: { commentText },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useLazyGetUserTodosQuery,
  useUpdateTodoStatusMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useAddCommentMutation,
  useLazyGetUserCalendarTodosQuery,
  useDrageUserTodoMutation,
} = todoAPI;
