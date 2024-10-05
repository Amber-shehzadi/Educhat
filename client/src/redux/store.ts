// store.ts

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import chatSlice from "./conversation/chatSlice";
import chatDataSlice from "./conversation/chatDataSlice";
import selectedChatMessagesSlice from "./conversation/selectedChatMessagesSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    chat: chatSlice, // Add the chat reducer
    chatData: chatDataSlice, // Add the chat reducer
    slectedChatMessages: selectedChatMessagesSlice, // Add the chat reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Type for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Call the refresh token on every page load
const initializeApp = async () => {
  await store.dispatch(
    apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
  );
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
