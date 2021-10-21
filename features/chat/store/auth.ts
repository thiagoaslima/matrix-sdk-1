import { PayloadAction, createSlice } from '@reduxjs/toolkit';


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
    authenticate(state, action: PayloadAction<any>) {
      authenticateChatClient(state, action);
    },
    deauthenticate(_state, _action) {
      return deauthenticateChatClient();
    }
  },
});

export const { authenticate, deauthenticate } = authSlice.actions;

export default authSlice.reducer;

function authenticateChatClient(state: AuthState, { payload }: { payload: any}) {
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
