import { createAction } from "@reduxjs/toolkit"
import { call, put, takeLatest } from "@redux-saga/core/effects";
import { InternalAPI } from '../../../../lib/internal-api';

export const logout = createAction<{ userId: string }, 'chat/auth/logout'>('chat/auth/logout');
export const logoutFulfilled = createAction<void, 'chat/auth/logout/fulfilled'>('chat/auth/logout/fulfilled');
export const logoutRejected = createAction<{ error: unknown }, 'chat/auth/logout/rejected'>('chat/auth/logout/rejected');

export async function makeLogout(userId: string): Promise<void> {
  const url = InternalAPI.url('/chat/logout');
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
}

function* logoutSaga({ payload }: ReturnType<typeof logout>) {
  try {
    yield call(makeLogout, payload.userId);
    yield put(logoutFulfilled())
  } catch(error) {
    yield put(logoutRejected({ error }))
  }
}

export function* watchLogout() {
  yield takeLatest(logout, logoutSaga)
}
