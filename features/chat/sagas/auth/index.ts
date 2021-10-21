import { all } from 'redux-saga/effects'
import { watchLogin } from './login'
import { watchLogout } from './logout';

export default function* authSagas() {
  yield all([
    watchLogin(),
    watchLogout(),
  ])
}