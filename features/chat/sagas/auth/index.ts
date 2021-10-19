import { all } from 'redux-saga/effects'
import { watchLogin } from './login'
import { watchLoginWithToken } from './login-with-token';
import { watchLogout } from './logout';
import { watchStart } from './start';

export default function* authSagas() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchLoginWithToken(),
    watchStart()
  ])
}