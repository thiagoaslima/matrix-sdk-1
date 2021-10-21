import { createAction } from '@reduxjs/toolkit';
import { all, put, takeEvery } from '@redux-saga/core/effects';
import { User } from 'matrix-js-sdk';

import { matrixClient } from '../../services/client';

export const getUser = createAction('chat/user/get-user');
export const getUserFulfilled = createAction<SerializableUser>('chat/user/get-user/fulfilled');
export const getUserRejected = createAction<{ error: unknown }>('chat/user/get-user/rejected');

const properties = [
  'avatarUrl',
  'currentlyActive',
  'displayName',
  'events',
  'lastActiveAgo',
  'lastPresenceTs',
  'modified',
  'presence',
  'presenceStatusMsg',
  'rawDisplayName',
  'unstable_statusMessage',
  'userId'
] as const;

export type SerializableUser = Pick<User, Exclude<typeof properties[number], 'modified'>> & { modified: number } 

const toSerializableUser = (user: User): SerializableUser => {
  const response = Object.create(null);

  properties.forEach(prop => {
    if (prop in user) {
      response[prop] = user[prop];
    }
  });
  
  return JSON.parse(JSON.stringify(response));
}

function* getUserSaga() {
    const user = matrixClient.get().getUser(matrixClient.get().getUserId());
    yield put(getUserFulfilled(toSerializableUser(user)))
}

export function* watchGetUser() {

}