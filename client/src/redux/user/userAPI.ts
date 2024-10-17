import { apiSlice } from "../features/api/apiSlice";

export const userAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfilePicture: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),

    updateCoverPicture: builder.mutation({
      query: (coverPicture) => ({
        url: "update-user-coverpicture",
        method: "PUT",
        body: { coverPicture },
        credentials: "include" as const,
      }),
    }),

    updateUserPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

    getChatUser: builder.query({
      query: () => ({
        url: "all-users-for-chat",
        method: "GET",
        // body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),
    // by admin
    createFaculty: builder.mutation({
      query: ({ email, name, password }) => ({
        url: "add-coordinator",
        method: "POST",
        body: { email, name, password },
        credentials: "include" as const,
      }),
    }),
    updateFaculty: builder.mutation({
      query: ({ email, name, password, id }) => ({
        url: `update-coordinator/${id}`,
        method: "PUT",
        body: { email, name, password },
        credentials: "include" as const,
      }),
    }),

    createTeacherStudent: builder.mutation({
      query: ({
        email,
        name,
        password,
        address,
        cnic,
        contact,
        gender,
        role,
        avatar,
        reg_no,
        classId,
      }) => ({
        url: "/add-teacher-student",
        method: "POST",
        body: {
          email,
          name,
          password,
          address,
          cnic,
          contact,
          gender,
          role,
          avatar,
          reg_no,
          classId,
        },
        credentials: "include" as const,
      }),
    }),

    getAllfaculties: builder.query({
      query: () => ({
        url: "faculties-for-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getAllteachers: builder.query({
      query: () => ({
        url: "get-all-teachers",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getAllStudents: builder.query({
      query: () => ({
        url: "get-all-students",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getFeedBackTeacher: builder.query({
      query: () => ({
        url: "get-teachers-for-feedback",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getUserCount: builder.query({
      query: () => ({
        url: "/user-count",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    addFeedback: builder.mutation({
      query: ({ teacherId, feedbackText }) => ({
        url: "add-feedback",
        method: "POST",
        body: { teacherId, feedbackText },
        credentials: "include" as const,
      }),
    }),

    updateRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: "/update-user-role",
        method: "PUT",
        body: { id: userId, role },
        credentials: "include" as const,
      }),
    }),

    verifyUser: builder.mutation({
      query: ({ userId, isVerified }) => ({
        url: "/verfiy-user",
        method: "PUT",
        body: { id: userId, isVerified },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useUpdateProfilePictureMutation,
  useUpdateCoverPictureMutation,
  useUpdateUserPasswordMutation,
  useLazyGetChatUserQuery,
  useCreateFacultyMutation,
  useLazyGetAllfacultiesQuery,
  useCreateTeacherStudentMutation,
  useLazyGetAllteachersQuery,
  useLazyGetAllStudentsQuery,
  useLazyGetFeedBackTeacherQuery,
  useAddFeedbackMutation,
  useLazyGetUserCountQuery,
  useUpdateRoleMutation,
  useUpdateFacultyMutation,
  useVerifyUserMutation,
} = userAPI;
