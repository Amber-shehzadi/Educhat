// features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  value: [];
}

const initialState: ChatState = {
  value: [],
};

const selectedChatMessages = createSlice({
  name: "selectedChatMessages",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = selectedChatMessages.actions;

export default selectedChatMessages.reducer;
