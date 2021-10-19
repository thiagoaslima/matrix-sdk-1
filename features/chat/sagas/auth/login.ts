import { createAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from '@redux-saga/core/effects';

import { InternalAPI } from '../../../../lib/internal-api';
import { LoginResponse } from '../../../../pages/api/chat/login';
import { logoutRejected } from './logout';

export type MatrixAuthData = {
  userId: string;
  deviceId: string;
  accessToken: string;
  homeServerDomain: string;
}

export const adaptLoginResponse = (loginData: LoginResponse): MatrixAuthData => ({
  userId: loginData['user_id'],
  deviceId: loginData['device_id'],
  accessToken: loginData['access_token'],
  homeServerDomain: loginData['home_server']
});

export const login = createAction<{ userId: string }>('chat/auth/login');
export const loginFulfilled = createAction<MatrixAuthData>('chat/auth/login/fulfilled');
export const loginRejected = createAction<{ error: unknown }>('chat/auth/login/rejected');

async function makeLogin(userId: string): Promise<MatrixAuthData> {
  const url = InternalAPI.url('/chat/login');
  
  const loginResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  const loginData: LoginResponse = await loginResponse.json();
  
  if (loginResponse.status === 200) {  
    return adaptLoginResponse(loginData);
  } else {
    console.error(loginData)
    throw new Error('Unable to login');
  }
}

function* loginSaga({ payload }: ReturnType<typeof login>) {
  try {
    const authData: MatrixAuthData = yield call(makeLogin, payload.userId);
    yield put(loginFulfilled(authData))
  } catch(error) {
    yield put(loginRejected({ error }))
    yield put(logoutRejected({ error }))
  }
}

export function* watchLogin() {
  yield takeLatest(login, loginSaga)
}