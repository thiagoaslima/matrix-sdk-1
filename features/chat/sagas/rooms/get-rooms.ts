import { call, put, takeEvery } from 'redux-saga/effects';

import { actions } from '../../store/v2';
import { chatClient } from '../../services/client-sdk/client';
import { Room } from '../../types/room';


function* getRoomsSaga() {
  const response: {
    rooms: Room[];
    nextBatch?: string;
    previousBatch?: string;
    totalRooms?: number;
  } = yield call(chatClient.getAllRooms.bind(chatClient));
  const joinedRooms: Room[] = yield call(chatClient.getJoinedRooms.bind(chatClient));


  yield put(actions.addRooms(response))
  yield put(actions.addJoinedRooms({ rooms: joinedRooms }))
  // const allMessages = rooms.map(room => {

  //   return room.getLiveTimeline().getEvents().reduce((acc, event) => {
  //     if (event.event.type === 'm.room.message') {
  //       acc.push(event.event);
  //     }
  //     return acc;
  //   }, [] as any[]);
  // }).filter(arr => arr.length > 0);


  // yield all([
  //   put(getRoomsFulfilled(rooms.map(toChatRoom))),
  //   ...allMessages.map(messages => put(addMessages(messages)))
  // ])
}

export function* watchReadyState() {
  yield takeEvery(actions.ready, getRoomsSaga)
}

