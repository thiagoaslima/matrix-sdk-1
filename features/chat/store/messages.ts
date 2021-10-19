import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  EntityState,
} from '@reduxjs/toolkit'
import { ChatMessageEvent } from '../types/events';
import { MessageContent } from '../types/message';
import { ChatRoom } from './rooms';
import { groupBy } from '../../../lib/group-by';

export type ChatMessage = {
  message: MessageContent;
  timestamp: number;
  eventId: string;
  roomId: string;
  sender: string;
}

const fromEventToChatMessage = (event: ChatMessageEvent): ChatMessage => {
  return {
    message: event.content,
    timestamp: event.origin_server_ts,
    eventId: event.event_id,
    roomId: event.room_id,
    sender: event.sender
  }
}

export const chatMessageAdapter = createEntityAdapter<ChatMessage>({
  selectId: (message) => message.eventId,
  sortComparer: (a, b) => a.timestamp - b.timestamp
})

export type ChatMessagesState = {
  rooms: Record<ChatRoom['roomId'], EntityState<ChatMessage>>
}

const addRoom = (state: ChatMessagesState, roomId: string) => {
  if (!state.rooms[roomId]) {
    state.rooms[roomId] = chatMessageAdapter.getInitialState();
  }
}


export const chatMessagesIntialState: ChatMessagesState = {
  rooms: {}
}

export const messagesSlice = createSlice({
  name: 'chat/messages',
  initialState: chatMessagesIntialState,
  reducers: {
    addMessage(state, { payload }: PayloadAction<ChatMessageEvent>) {
      const message = fromEventToChatMessage(payload);
      addRoom(state, message.roomId);
      state.rooms[message.roomId] = chatMessageAdapter.upsertOne(state.rooms[message.roomId], message);
    },
    addMessages(state, { payload }: PayloadAction<ChatMessageEvent[]>) {
      const messages = payload.map(fromEventToChatMessage);
      const groups: Record<string, ChatMessage[]> = groupBy(messages, 'roomId');

      const stateUpdate = Object.keys(groups).reduce((acc, roomId) => {
        const group = groups[roomId];
        addRoom(state, roomId);
        acc[roomId] = chatMessageAdapter.upsertMany(state.rooms[roomId], group);
        return acc;
      }, {} as any)

      state.rooms = {
        ...state.rooms,
        ...stateUpdate
      }
    }
  },
});

export const charMessagesSelectors = chatMessageAdapter.getSelectors();
export const { addMessage, addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
