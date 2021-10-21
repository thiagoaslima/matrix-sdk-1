import { put, select, call, takeEvery } from 'redux-saga/effects';
import { ISendEventResponse } from 'matrix-js-sdk/lib/@types/requests';

import { actions,  } from '../../store/v2/index';
import { chatClient } from '../../services/client-sdk/client';
import { MessageContent } from '../../types/message';
import { RootState } from '../../../../app/store-v2';

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