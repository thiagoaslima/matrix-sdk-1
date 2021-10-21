import { all } from 'redux-saga/effects'
import { watchReadyState } from './get-rooms'
import { watchSendMessage } from './send-message';
import { watchSetCurrentRoom } from './set-current-room';

export default function* roomSagas() {
  yield all([
    watchReadyState(),
    watchSendMessage(),
    watchSetCurrentRoom(),
  ]);
}
