import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from 'matrix-js-sdk';
import { logoutFulfilled } from '../sagas/auth/logout';
import { getUserFulfilled, SerializableUser } from '../sagas/user/get-user';

export type ChatUserState = { 
  id: string;
  displayName: string;
  avatarUrl: string;
  statusMessage: string;
}

export const userInitialState: ChatUserState = { 
  id: '',
  displayName: '',
  avatarUrl: '',
  statusMessage: ''
};

export const userSlice = createSlice({
  name: 'chat/user',
  initialState: userInitialState,
  reducers: {
    resetUser(_state, _action) {
      return reset();
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUserFulfilled, setUser)
    .addCase(logoutFulfilled, reset)
  }
});

export const { resetUser } = userSlice.actions;

export default userSlice.reducer;

function setUser(state: ChatUserState, { payload }: { payload: SerializableUser }) {
  state.id = payload.userId;
  state.avatarUrl = payload.avatarUrl;
  state.displayName = payload.displayName;
  state.statusMessage = payload.presenceStatusMsg
};

function reset() {
  return userInitialState;
}
