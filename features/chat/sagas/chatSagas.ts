import { all } from 'redux-saga/effects'

import authSagas from './auth';
import roomSagas from './rooms';

export default function* chatSagas() {
  yield all([
    authSagas(),
    roomSagas()
  ])
}
