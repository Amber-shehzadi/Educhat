// features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  value: string | undefined | null;
}

const initialState: ChatState = {
  value: undefined,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string | undefined | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = chatSlice.actions;

export default chatSlice.reducer;
