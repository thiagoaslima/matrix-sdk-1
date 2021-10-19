import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from "redux-saga";

import chatSliceReducer from '../../features/chat/store/index';
import { chatInitialState } from '../../features/chat/store/index';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

export const appStore = configureStore({
  devTools: true,
  reducer: {
    chat: chatSliceReducer
  },
  preloadedState: {
    chat: chatInitialState
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: false,
    immutableCheck: true,
    serializableCheck: true
  }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appStore.getState>

export type AppDispatch = typeof appStore.dispatch
