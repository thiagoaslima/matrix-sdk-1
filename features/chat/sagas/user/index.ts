import { all } from 'redux-saga/effects'
import { watchGetUser } from './get-user';

export default function* userSagas() {
  yield all([
    watchGetUser()
  ])
}