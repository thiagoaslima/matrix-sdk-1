import { eventChannel } from 'redux-saga'
import { put, all, take, takeLatest, race } from "redux-saga/effects";
import { matrixClient } from "../../services/client";
import { deauthenticate } from '../../store/auth';
import { addMessage } from '../../store/messages';
import { setCurrentRoom } from "../../store/rooms";
import { ChatMessageEvent } from '../../types/events';

export function* handleRoomEvents(payload: { roomId: string }) {
  
  const messageChannel = eventChannel(emitter => {
    const client = matrixClient.get();

    client.on('Room.timeline', function (event, room, toStartOfTimeline) {
      
      // we know we only want to respond to messages
      if (event.getType() === "m.room.message") {
        emitter(event.event);
      }
    })

    // The subscriber must return an unsubscribe function
    return () => {
      client.off('Room.timeline', emitter)
    }
  })

  while (true) {
    const result: {messageEvent: ChatMessageEvent, cancelEvent: unknown} = yield race({
      messageEvent: take(messageChannel),
      cancelEvent: take([setCurrentRoom, deauthenticate]),
    })
    
    if (result.messageEvent) {
      yield put(addMessage(result.messageEvent))
    } 

    if (result.cancelEvent) {
      messageChannel.close()
      return
    }
    
  }
}

export function* watchSetCurrentRoom() {
  yield all([
    takeLatest(setCurrentRoom, handleRoomEvents),
  ])
}