import { all } from 'redux-saga/effects'
import { watchReadyState } from './get-rooms'

export default function* roomSagas() {
  yield watchReadyState();
}
