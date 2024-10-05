// features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  value: any;
}

const initialState: ChatState = {
  value: undefined,
};

const chatDataSlice = createSlice({
  name: "chatData",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = chatDataSlice.actions;

export default chatDataSlice.reducer;
