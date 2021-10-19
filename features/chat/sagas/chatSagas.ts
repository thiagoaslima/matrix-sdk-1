import { all } from 'redux-saga/effects'

import authSagas from './auth';
import roomSagas from './rooms';
import userSagas from './user/index';

export default function* chatSagas() {
  yield all([
    authSagas(),
    roomSagas(),
    userSagas()
  ])
}
