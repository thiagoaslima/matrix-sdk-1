import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  EntityState,
} from '@reduxjs/toolkit'
import { JoinRule } from 'matrix-js-sdk/lib/@types/partials'
import { getRoomsFulfilled } from '../sagas/rooms/get-rooms';

export type ChatRoom = { 
  name: string;
  roomId: string;
  canonicalAlias: string | null;
  joinRule: JoinRule;
  joinedMembersTotal: number;
  members: string[];
  messages: string[];
}

export const chatRoomsAdapter = createEntityAdapter<ChatRoom>({
  selectId: (room) => room.roomId,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export type ChatRoomsState = EntityState<ChatRoom> & {
  joinedRooms: ChatRoom['roomId'][];
  currentRoom: ChatRoom['roomId'] | null;
  hasMoreRooms: boolean;
  nextChunk?: string;
}

export const chatRoomsIntialState: ChatRoomsState = chatRoomsAdapter.getInitialState({
  joinedRooms: [] as string[],
  currentRoom: null,
  hasMoreRooms: true
})

export const roomsSlice = createSlice({
  name: 'chat/rooms',
  initialState: chatRoomsIntialState,
  reducers: {
    setCurrentRoom(state, { payload }: PayloadAction<{ roomId: ChatRoom['roomId'] }>) {
      state.currentRoom = payload.roomId
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomsFulfilled.toString(), setRegisterRooms)
  }
});

export const chatRoomsSelectors = chatRoomsAdapter.getSelectors()
export const { setCurrentRoom } = roomsSlice.actions;

export default roomsSlice.reducer;

function setRegisterRooms(state: ChatRoomsState, { payload }: PayloadAction<ReturnType<typeof getRoomsFulfilled>>) {  
  chatRoomsAdapter.upsertMany(state, payload as unknown as ChatRoom[]);
};
