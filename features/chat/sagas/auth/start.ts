import { createAction } from '@reduxjs/toolkit';
import { all, fork, put, take, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { Channel, channel } from '@redux-saga/core';

import { matrixClient } from '../../services/client';
import { loginWithTokenFulfilled } from './login-with-token';


export type ClientStartResponse = {
  ready: true;
  prevState: any;
  res: any;
}

export const start = createAction<void>('chat/auth/start');
export const startFulfilled = createAction<ClientStartResponse>('chat/auth/start/fulfilled');
export const startRejected = createAction<{ error: unknown }>('chat/auth/start/rejected');

function* startSaga() {
  try {
    const response: ClientStartResponse = yield matrixClient.start();
    yield put(startFulfilled(response))
  } catch (error) {
    yield put(startRejected({ error }));
  }
}



export function* watchStart() {
  yield all([
    takeLatest(loginWithTokenFulfilled, startSaga),
    takeEvery(start, startSaga)
  ]);
  
}