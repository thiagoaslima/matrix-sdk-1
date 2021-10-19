import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { Device } from '../../types/device';

export interface ChatState {
  logged: boolean;
  ready: boolean;
  user: User | null;
  device: Device | null;
}

const chatInitialState: ChatState = {
  logged: false,
  ready: false,
  user: null,
  device: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: chatInitialState,
  reducers: {
    login(state, { payload }: PayloadAction<{user: User, device: Device}>) {
      state.logged = true;
      state.user = payload.user;
    },
    logout(state, action) {
      state.logged = false;
      state.ready = false;
      state.user = null;
      state.device = null;
    },

  },
});
