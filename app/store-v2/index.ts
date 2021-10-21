import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';

import {chatSlice} from '../../features/chat/store/v2/index';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

export const appStore = configureStore({
  devTools: true,
  reducer: {
    chat: chatSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: false,
    immutableCheck: true,
    serializableCheck: true
  }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
