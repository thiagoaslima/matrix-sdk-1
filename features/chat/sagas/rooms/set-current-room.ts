import { eventChannel } from 'redux-saga'
import { put, all, take, race, select, call, takeEvery } from 'redux-saga/effects';
import { matrixClient } from "../../services/client";
import { deauthenticate } from '../../store/auth';
import { addMessage } from '../../store/messages';
import { setCurrentRoom } from "../../store/rooms";
import { ChatMessageEvent } from '../../types/events';
import { actions } from '../../store/v2/index';
import { chatClient } from '../../services/client-sdk/client';
import { MessageContent } from '../../types/message';
import { RoomEvent } from '../../types/room';

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

export function* handleSelection(action: { payload: { roomId: string } }) {
  const { roomId } = action.payload;
  const sdk = chatClient.getSDK();

  yield put(actions.syncingRoom({ roomId }))

  /** @TODO Handle errors */
  const roomSync: InitialSyncResponse = yield call(sdk.roomInitialSync.bind(sdk), roomId, 50);
  const messages = roomSync.messages.chunk.map(item => convertEvent(item))

  yield put(actions.syncingRoomSuccess({ roomId }));
  yield put(actions.addRoomEvents({ events: messages }));
}

export function* setListener(action: { payload: { roomId: string } }) {

  const messageChannel = eventChannel(emitter => {
    const sdk = chatClient.getSDK();

    sdk.on('Room.timeline', function (event) {
      debugger;

      // we know we only want to respond to messages
      if (event.getType() === "m.room.message") {
        emitter(convertEvent(event.event));
      }
    })

    // The subscriber must return an unsubscribe function
    return () => {
      sdk.off('Room.timeline', emitter)
    }
  })

  while (true) {
    const result: { messageEvent: RoomEvent, cancelEvent: unknown } = yield race({
      messageEvent: take(messageChannel),
      cancelEvent: take([setCurrentRoom, deauthenticate]),
    })

    if (result.messageEvent) {
      yield put(actions.addRoomEvent({ event: result.messageEvent }))
    }

    if (result.cancelEvent) {
      messageChannel.close()
      return
    }

  }
}

export function* watchSetCurrentRoom() {
  yield all([
    takeEvery(actions.selectRoom, handleSelection),
    takeEvery(actions.selectRoom, setListener),
  ])
}