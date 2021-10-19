import { createAction } from '@reduxjs/toolkit';
import { all, put, takeEvery } from '@redux-saga/core/effects';
import { Room } from 'matrix-js-sdk';

import { matrixClient } from '../../services/client';
import { startFulfilled } from '../auth/start';
import { ChatRoom } from '../../store/rooms';
import { addMessages } from '../../store/messages';

export const getRooms = createAction('chat/rooms/get-rooms');
export const getRoomsFulfilled = createAction<Omit<ChatRoom, 'members' | 'messages'>[]>('chat/rooms/get-rooms/fulfilled');
export const getRoomsRejected = createAction<{ error: unknown }>('chat/rooms/get-rooms/rejected');

const toChatRoom = (room: Room): Omit<ChatRoom, 'members' | 'messages'> => {
  const chatRoom: Omit<ChatRoom, 'members' | 'messages'> = {
    roomId: room.roomId,
    name: room.name,
    canonicalAlias: room.getCanonicalAlias(),
    joinRule: room.getJoinRule(),
    joinedMembersTotal: room.getJoinedMemberCount()
  }

  return chatRoom;
}

function* handleRoomsSaga() {
    const rooms = matrixClient.getRooms();

    const allMessages = rooms.map(room => {

      return room.getLiveTimeline().getEvents().reduce((acc, event) => {
        if (event.event.type === 'm.room.message') {
          acc.push(event.event);
        }
        return acc;
      }, [] as any[]);
    }).filter(arr => arr.length > 0);

    
    yield all([
      put(getRoomsFulfilled(rooms.map(toChatRoom))),
      ...allMessages.map(messages => put(addMessages(messages)))
    ])
    
}

export function* watchGetRooms() {
  yield takeEvery(startFulfilled, handleRoomsSaga);
}

