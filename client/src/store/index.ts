import { create } from "zustand";
import { createChatSlice } from "./slice/chatSlice";

export const useAppStore = create()((set, get) => ({
  ...createChatSlice(set, get),
}));
