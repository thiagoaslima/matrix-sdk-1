import { createAction } from '@reduxjs/toolkit';
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { matrixClient } from '../../services/client';
import { loginFulfilled, MatrixAuthData } from './login';

export const loginWithToken = createAction<MatrixAuthData>('chat/auth/login-with-token');
export const loginWithTokenFulfilled = createAction<void>('chat/auth/login-with-token/fulfilled');
export const loginWithTokenRejected = createAction<{ error: unknown }>('chat/auth/login-with-token/rejected');

function* loginWithTokenSaga({ payload }: ReturnType<typeof loginFulfilled>) {
    matrixClient.authenticate(payload);
    yield put(loginWithTokenFulfilled())
}

export function* watchLoginWithToken() {
  yield all([
    takeEvery(loginFulfilled, loginWithTokenSaga),
    takeEvery(loginWithToken, loginWithTokenSaga)
  ])
}