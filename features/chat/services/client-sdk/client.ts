import { createClient, MatrixClient } from 'matrix-js-sdk';
import { SyncState } from 'matrix-js-sdk/lib/sync.api';

import { getEnv } from '../../../../lib/get-env';
import { Device } from '../../types/device';
import { PresenceEnum, User } from '../../types/user';

export type StartArgs = {
  accessToken: string,
  deviceId: string,
  userId: string
}

export class ChatClientSDK {
  private clientSettings = {
    baseUrl: getEnv().matrixServerUrl,
    timelineSupport: true,
    useAuthorizationHeader: true
  };

  private _client: MatrixClient = createClient(this.clientSettings);

  /**
   * @deprecated
   * @todo Remove
   */
  getSDK() {
    return this._client
  }

  /**
   * @deprecated
   * @todo Remove
   */
  getAccessToken() {
    return this._client.getAccessToken();
  }

  async authenticate({
    accessToken,
    deviceId,
    userId,
  }: StartArgs) {
    this._client = createClient({
      ...this.clientSettings,
      accessToken,
      deviceId,
      userId
    });

    await this._client.startClient({
      initialSyncLimit: 10,
      lazyLoadMembers: true,
    });
  }

  deauthenticate() {
    this.stop();
    this._client = createClient(this.clientSettings);
  }

  stop() {
    this._client.stopClient();
  }

  syncState(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._client.once('sync', (state: SyncState) => {
        if (state === SyncState.Prepared) {
          resolve(true)
        }
      });
    });
  }

  async getUserProfile(): Promise<User> {
    const user = this._client.getUser(this._client.getUserId());
    const profile = await this._client.getProfileInfo(this._client.getUserId());
    const presenceResponse = await this._client.getPresence(this._client.getUserId()) as { presence: PresenceEnum };

    return {
      id: user.userId,
      displayName: profile.displayname ?? user.displayName,
      avatarUrl: profile.avatar_url ?? user.avatarUrl,
      status: {
        presence: presenceResponse.presence,
        message: user.presenceStatusMsg ?? null,
        lastActiveAgo: user.getLastActiveTs(),
        isActive: user.currentlyActive
      }
    }
  } 
  
  async getDevice(): Promise<Device> {
    const device = await this._client.getDevice(this._client.getDeviceId())

    return {
      id: device.device_id,
      displayName: device.display_name,
      lastSeenAt: device.last_seen_ts
    }
  }

  async getJoinedRooms() {
    const response = this._client.getRooms();

    const rooms = response.map(room => ({
      id: room.roomId,
      name: room.name,
      canonicalAlias: room.getCanonicalAlias() ?? undefined,
      members: {
        list: room.getJoinedMembers().map(member => ({
          id: member.userId,
          name: member.name
        })),
        total: room.getJoinedMemberCount(),
      },
    }));

    return rooms;
  }

  async getAllRooms(lastToken?: string) {
    const response = await this._client.publicRooms({
      limit: 100,
      since: lastToken
    });

    const rooms = response.chunk.map(item => {
      return {
        id: item.room_id,
        name: item.name,
        topic: item.topic,
        canonicalAlias: item.canonical_alias,
      }
    });

    return {
      rooms,
      nextBatch: response.next_batch,
      previousBatch: response.prev_batch,
      totalRooms: response.total_room_count_estimate
    }
  }
}

export const chatClient = new ChatClientSDK()