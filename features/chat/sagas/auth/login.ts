import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as authService from '../../services/auth/auth.service';
import { actions } from '../../store/v2/index';
import { chatClient } from '../../services/client-sdk/client';
import { User } from '../../types/user';
import { Device } from '../../types/device';

function* loginSaga({ payload }: { payload: { userId: string }}) {
  try {
    const loginResponse: authService.LoginResponse = yield call(authService.login, payload.userId);
    yield chatClient.authenticate(loginResponse);
    
    yield put(actions.loginSuccess({ token: loginResponse.accessToken }))
  } catch(error) {
    yield put(actions.loginFailed())
  }
}

function* startSaga() {
  const [_, user, device]: [true, User, Device] = yield all([
    call(chatClient.syncState.bind(chatClient)),
    call(chatClient.getUserProfile.bind(chatClient)),
    call(chatClient.getDevice.bind(chatClient)),
  ])

  yield put(actions.ready({ user, device }))
}

export function* watchLogin() {
  yield all([
    takeLatest(actions.login, loginSaga),
    takeLatest(actions.loginSuccess, startSaga)
  ]);
}