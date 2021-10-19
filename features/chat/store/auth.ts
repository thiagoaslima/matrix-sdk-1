import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { logoutFulfilled } from '../sagas/auth/logout';
import { startFulfilled, startRejected } from '../sagas/auth/start';
import { loginFulfilled, loginRejected, MatrixAuthData } from '../sagas/auth/login';

type AuthenticatedChatState = {
  userId: string;
  accessToken: string;
  homeServer: string;
  deviceId: string;
}

export type AuthState = { logged: false; ready: false } | { logged: true; ready: boolean; } & AuthenticatedChatState;

export const authInitialState: AuthState= { logged: false, ready: false };

export const authSlice = createSlice({
  name: 'chat/auth',
  initialState: authInitialState as AuthState,
  reducers: {
    authenticate(state, action: PayloadAction<MatrixAuthData>) {
      authenticateChatClient(state, action);
    },
    deauthenticate(_state, _action) {
      return deauthenticateChatClient();
    }
  },
  extraReducers: (builder) => {
    builder
    // Login
    .addCase(loginFulfilled, authenticateChatClient)
    .addCase(loginRejected, deauthenticateChatClient)

    // Logout
    .addCase(logoutFulfilled, deauthenticateChatClient)
    
    // Start
    .addCase(startFulfilled, startChatClient)
    .addCase(startRejected, deauthenticateChatClient)
  }
});

export const { authenticate, deauthenticate } = authSlice.actions;

export default authSlice.reducer;

function authenticateChatClient<T extends MatrixAuthData = MatrixAuthData>(state: AuthState, { payload }: { payload: T}) {
  state.logged = true;
  state.ready = false;
  Object.assign(state, payload);
}

function deauthenticateChatClient() {
  return authInitialState;
}

function startChatClient(state: AuthState, { payload }: { payload: any}) {
  state.ready = true;
}
