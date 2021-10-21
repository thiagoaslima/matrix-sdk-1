import { call, put, takeLatest } from "redux-saga/effects";

import { actions } from "../../store/v2";
import * as authService from '../../services/auth/auth.service';


function* logoutSaga({ payload }: { payload: { userId: string }}) {
  try {
    yield call(authService.logout, payload.userId);
    
    yield put(actions.logoutSuccess())
  } catch(error) {
    yield put(actions.logoutFailed())
  }
}

export function* watchLogout() {
  yield takeLatest(actions.logout, logoutSaga)
}
