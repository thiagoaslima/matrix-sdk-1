import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../types/user";
import { Device } from '../../types/device';
import { Room, RoomEvent } from '../../types/room';

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
  events: { 
    perRoom: {
      [roomId: Room['id']]: {
        isSyncing: boolean;
        list: Set<RoomEvent['id']>;
        prevBatch?: string;
        nextBatch?: string;
      }
    }
    entities: Record<string, RoomEvent>;
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
  },
  events: {
    perRoom: {},
    entities: {}
  }
}

const sendMessage = createAction<{ roomId: string, text: string }, 'chat/send-message'>('chat/send-message');

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
      addRoomToState(state, payload);
      orderRooms(state, 'available')
    },
    addRooms(state, { payload }: PayloadAction<{ rooms: Room[] }>) {
      payload.rooms.forEach((room) => {
        addRoomToState(state, { room })
      })
      orderRooms(state, 'available')
    },

    addJoinedRoom(state, { payload }: PayloadAction<{ room: Room }>) {
      addJoinedRoomToState(state, payload);
      orderRooms(state, 'joined');
    },
    addJoinedRooms(state, { payload }: PayloadAction<{ rooms: Room []}>) {
      payload.rooms.forEach((room) => {
        addJoinedRoomToState(state, { room } );
        orderRooms(state, 'joined');
      })
    },

    selectRoom(state, { payload }: PayloadAction<{ roomId: string }>) {
      state.rooms.current = payload.roomId;
    },

    syncingRoom(state, { payload }: PayloadAction<{ roomId: string }>) {
      createPerRoomState(state, payload.roomId);
      state.events.perRoom[payload.roomId].isSyncing = true
    },
    syncingRoomSuccess(state, { payload }: PayloadAction<{ roomId: string }>) {
      createPerRoomState(state, payload.roomId);
      state.events.perRoom[payload.roomId].isSyncing = false
    },

    /** @todo Organize in helper functions */
    addRoomEvent(state, { payload }: PayloadAction<{event: RoomEvent}>) {
      const event = payload.event;
      const room = state.rooms.entities[payload.event.roomId];
      
      if (room) {
        createPerRoomState(state, room.id);
        state.events.perRoom[room.id].list.add(event.id);
        state.events.entities[event.id] = { ...state.events.entities[event.id], ...event } 
        
        const entities = state.events.entities;
        const arr = Array.from(state.events.perRoom[room.id].list);
        arr.sort((a, b) => entities[a].serverTimestamp - entities[b].serverTimestamp);
        state.events.perRoom[room.id].list = new Set(arr)
      }
    },
    addRoomEvents(state, { payload }: PayloadAction<{events: RoomEvent[]}>) {
      const room = state.rooms.entities[payload.events[0].roomId]

      if (room) {
        createPerRoomState(state, room.id);
        
        payload.events.forEach(event => {
          state.events.perRoom[room.id].list.add(event.id);
          state.events.entities[event.id] = { ...state.events.entities[event.id], ...event } 
        });

        const entities = state.events.entities;
        const arr = Array.from(state.events.perRoom[room.id].list);
        arr.sort((a, b) => entities[a].serverTimestamp - entities[b].serverTimestamp);
        state.events.perRoom[room.id].list = new Set(arr)
      }
    },
    removeRoomEvent(state, { payload }: PayloadAction<{eventId: string, roomId: string}>) {
      const { eventId, roomId } = payload;
      const room = state.rooms.entities[roomId];
      
      if (room) {
        createPerRoomState(state, roomId);
        state.events.perRoom[room.id].list.delete(eventId);
        delete state.events.entities[eventId];
      }
    }
  },
});

export const actions = {
  sendMessage,
  ...chatSlice.actions
}

function addRoomToState(state: ChatState, payload: { room: Room; }) {
  state.rooms.available.add(payload.room.id);
  state.rooms.joined.delete(payload.room.id);
  state.rooms.entities[payload.room.id] = { ...state.rooms.entities[payload.room.id], ...payload.room };
}

function addJoinedRoomToState(state: ChatState, payload: { room: Room; }) {
  state.rooms.available.delete(payload.room.id);
  state.rooms.joined.add(payload.room.id);
  state.rooms.entities[payload.room.id] = { ...state.rooms.entities[payload.room.id], ...payload.room };
}

function orderRooms(state: ChatState, group: 'joined' | 'available') {
  const roomMap = state.rooms.entities;
  const arr = Array.from(state.rooms[group]);
  arr.sort((a, b) => roomMap[a].name.localeCompare(roomMap[b].name))
  state.rooms[group] = new Set(arr);
}

function resetState(state: ChatState) {
  state.status.loading = false;
  state.status.logged = false;
  state.status.accessToken = undefined;
  state.user = null;
  state.device = null;
}

function createPerRoomState(state: ChatState, roomId: string) {
  if (!state.events.perRoom[roomId]) {
    state.events.perRoom[roomId] = { isSyncing: false, list: new Set() };
  }
}
