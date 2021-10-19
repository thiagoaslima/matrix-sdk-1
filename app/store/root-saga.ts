import { all } from "redux-saga/effects";

import chatSagas from "../../features/chat/sagas/chatSagas";

export default function* rootSaga() {
  yield all([
    chatSagas()
  ])
}
