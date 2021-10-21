import { eventChannel } from 'redux-saga'
import { put, all, take, race, select, call, takeEvery } from 'redux-saga/effects';
import { matrixClient } from "../../services/client";
import { deauthenticate } from '../../store/auth';
import { addMessage } from '../../store/messages';
import { setCurrentRoom } from "../../store/rooms";
import { ChatMessageEvent } from '../../types/events';
import { actions, ChatState } from '../../store/v2/index';
import { chatClient } from '../../services/client-sdk/client';
import { MessageContent } from '../../types/message';
import { RoomEvent } from '../../types/room';
import { RootState } from '../../../../app/store-v2';
import { ISendEventResponse } from 'matrix-js-sdk/lib/@types/requests';

type RawEvent = {
  content: MessageContent,
  "origin_server_ts": number;
  "room_id": string;
  "sender": string;
  "type": "m.room.message",
  "event_id": string;
  "user_id": string;
  "age": number;
}

type InitialSyncResponse = {
  messages: {
    chunk: RawEvent[],
    start: string;
    end: string;
  }
}

const convertEvent = (item: RawEvent) => ({
  id: item.event_id,
  type: item.type,
  content: item.content,
  roomId: item.room_id,
  sender: item.sender,
  serverTimestamp: item.origin_server_ts
})

let tempId = 0;
const getTempId = () => `temp-event-${+tempId}`

export function* handleSendMessage(action: { payload: { roomId: string, text: string } }) {
  const { roomId, text } = action.payload;
  const state: RootState = yield select();
  const sdk = chatClient.getSDK();

  const event = {
    id: getTempId(),
    type: 'm.room.message',
    content: {
      body: text,
      msgtype: 'm.text'
    },
    roomId,
    sender: state.chat.user?.id ?? '',
    serverTimestamp: Date.now()
  }

  yield put(actions.addRoomEvent({ event }));

  debugger;
  /** @TODO Handle errors */
  const msgResponse: ISendEventResponse = yield call(sdk.sendMessage.bind(sdk), roomId, event.content);
  debugger;

  yield put(actions.removeRoomEvent({ eventId: event.id, roomId }));
}

export function* watchSendMessage() {
  yield takeEvery(actions.sendMessage, handleSendMessage)
}