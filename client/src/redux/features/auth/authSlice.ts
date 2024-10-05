// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: "",
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    userRegistration: (state, action) => {
      state.token = action.payload.token;
      state.loading = false;
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.loading = false;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  userRegistration,
  userLoggedIn,
  userLoggedOut,
} = authSlice.actions;

export default authSlice.reducer;
