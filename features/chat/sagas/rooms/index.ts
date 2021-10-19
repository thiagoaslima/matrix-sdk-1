import { all } from 'redux-saga/effects'
import { watchGetRooms } from './get-rooms'
import { watchSetCurrentRoom } from './set-current-room'

export default function* roomSagas() {
  yield all([
    watchGetRooms(),
    watchSetCurrentRoom()
  ])
}