import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../types/user";
import { Device } from '../../types/device';
import { Room } from "../../types/room";

export interface ChatState {
  status: {
    loading: boolean;
    logged: boolean;
    accessToken?: string;
    ready: boolean
  },
  user: User | null;
  device: Device | null;
  rooms: {
    current: Room['id'] | null;
    total: number;
    nextBatch?: string;
    prevBatch?: string;
    available: Set<Room['id']>;
    joined: Set<Room['id']>;
    entities: Record<string, Room>;
  }
}

const chatInitialState: ChatState = {
  status: {
    loading: false,
    logged: false,
    ready: false,
  },
  user: null,
  device: null,
  rooms: {
    total: 0,
    current: null,
    available: new Set<string>(),
    joined: new Set<string>(),
    entities: {}
  }

}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: chatInitialState,
  reducers: {
    login(state, _action: PayloadAction<{ userId: string }>) {
      state.status.loading = true;
    },
    loginSuccess(state, { payload }: PayloadAction<{ token: string }>) {
      state.status.logged = true;
      state.status.accessToken = payload.token;
    },
    loginFailed(state) {
      resetState(state);
    },

    logout(state, _action: PayloadAction<{ userId: string }>) {
      state.status.loading = true;
    },
    logoutSuccess(state) {
      resetState(state);
    },
    logoutFailed(state) {
      state.status.loading = false;
    },

    ready(state, { payload }: PayloadAction<{ user: User, device: Device }>) {
      state.status.loading = false;
      state.status.ready = true;
      state.user = payload.user;
      state.device = payload.device;
    },

    addRoom(state, { payload }: PayloadAction<{ room: Room }>) {
      state.rooms.available.add(payload.room.id);
      state.rooms.joined.delete(payload.room.id);
      state.rooms.entities[payload.room.id] = { ...state.rooms.entities[payload.room.id], ...payload.room };
    },
    addRooms(state, { payload }: PayloadAction<{ rooms: Room[] }>) {
      debugger;
      payload.rooms.forEach((room) => {
        chatSlice.caseReducers.addRoom(state, { type: 'chat/addRoom', payload: { room } })
      })
    },

    addJoinedRoom(state, { payload }: PayloadAction<{ room: Room }>) {
      state.rooms.joined.add(payload.room.id);
      state.rooms.available.delete(payload.room.id);
      state.rooms.entities[payload.room.id] = payload.room;
    },
    addJoinedRooms(state, { payload }: PayloadAction<{ rooms: Room []}>) {
      payload.rooms.forEach((room) => {
        chatSlice.caseReducers.addJoinedRoom(state, { type: 'chat/addJoinedRoom', payload: { room } })
      })
    },

  },
});

export const actions = {
  ...chatSlice.actions
}

function resetState(state: ChatState) {
  state.status.loading = false;
  state.status.logged = false;
  state.status.accessToken = undefined;
  state.user = null;
  state.device = null;
}
