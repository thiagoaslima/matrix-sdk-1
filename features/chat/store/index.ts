import type { RootState } from '../../../app/store'
import { AuthState, authSlice, authInitialState } from './auth'
import { userInitialState, ChatUserState, userSlice } from './user';
import { chatRoomsIntialState, ChatRoomsState, roomsSlice, chatRoomsAdapter } from './rooms';
import messages, { chatMessagesIntialState, ChatMessagesState, messagesSlice } from './messages';
import { createSelector } from 'reselect';
import { chatMessageAdapter } from './messages';

// Define a type for the slice state
export interface ChatState {
  auth: AuthState;
  user: ChatUserState,
  rooms: ChatRoomsState,
  messages: ChatMessagesState,
}

export const chatInitialState = {
  auth: authInitialState,
  user: userInitialState,
  rooms: chatRoomsIntialState,
  messages: chatMessagesIntialState
}

const chatReducer = (state: ChatState = chatInitialState, action: any) => ({
  auth: authSlice.reducer(state.auth, action),
  user: userSlice.reducer(state.user, action),
  rooms: roomsSlice.reducer(state.rooms, action),
  messages: messagesSlice.reducer(state.messages, action)
})


// Other code such as selectors can use the imported `RootState` type
export const selectChatAuthState = (state: RootState) => state.chat.auth;
export const selectChatUserState = (state: RootState) => state.chat.user;
export const selectChatRoomsState = (state: RootState) => state.chat.rooms;
export const selectChatMessagesState = (state: RootState) => state.chat.messages;
export const selectChatRooms = chatRoomsAdapter.getSelectors((state: RootState) => state.chat.rooms);

export const selectCurrentChatRoom = createSelector(selectChatRoomsState, (state: ChatRoomsState) => {
  const curr = state.currentRoom;

  if (!curr) {
    return null;
  }

  return state.entities[curr] ?? null
});

export const selectCurrentChatRoomMessages = createSelector(
  (state: RootState) => state,
  (state: RootState) => {
    const currentRoom = selectCurrentChatRoom(state);
    
    if (!currentRoom) {
      return []
    }

    const selectors = chatMessageAdapter.getSelectors((state: RootState) => state.chat.messages.rooms[currentRoom.roomId] ?? {ids: [], entities: {}})
    const messages = selectors.selectAll(state);

    return messages;
  },
  
);

export default chatReducer;