import { createClient, MatrixClient } from "matrix-js-sdk";
import { SyncState } from "matrix-js-sdk/lib/sync.api";
import { getEnv } from '../../../lib/get-env';

const BASE_SETTINGS = {
  baseUrl: getEnv().matrixServerUrl,
  timelineSupport: true,
  useAuthorizationHeader: true
};

class Client {
  private _client = this.createBaseClient();

  private createBaseClient(): MatrixClient {
    return createClient(BASE_SETTINGS);
  }

  get(): MatrixClient {
    return this._client;
  }

  authenticate(authData: Pick<any, 'accessToken' | 'deviceId' | 'userId'>): MatrixClient {
    try {
      this.stop();
  
      this._client = createClient({
        ...BASE_SETTINGS,
        accessToken: authData.accessToken,
        deviceId: authData.deviceId,
        userId: authData.userId
      });
  
      return this._client;
    } catch(err) {
      console.error(err);
      throw err
    }
  }

  deauthenticate(): MatrixClient {
    this._client = this.createBaseClient();
    return this._client;
  }

  async start() {
    if (!this._client.getUserId()) {
      throw new Error('Client is not authenticated')
    }
    
    if (this._client.clientRunning) {
      throw new Error('Client is already running')
    }
    
    await this._client.startClient({
      initialSyncLimit: 10,
      lazyLoadMembers: true,
    })
    
    return new Promise<{ ready: true, prevState: any, res: any}>((resolve) => {
      this._client.once('sync', (state: SyncState, prevState, res) => {
        if (state === SyncState.Prepared) {
          resolve({ ready: true, prevState, res })
        }
      });
    });
  }

  stop() {
    if (this._client?.clientRunning) {
      this._client.stopClient();
    }
  }

  getRooms() {
    return this._client.getRooms()
  }

  async getOlderEvents({
    roomId,
    oldestEventId,
    limit = 100
  }: {
    roomId: string, 
    oldestEventId: string,
    limit?: number
  }) {
    const url = `/_matrix/client/r0/rooms/${encodeURIComponent(roomId)}/context/${encodeURIComponent(oldestEventId)}?limit=${limit}`;

    const fetchResponse = await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._client.getAccessToken()}`
      }
    });
    const data = await fetchResponse.json();

    return data.events_before;
  }

  async getNewerEvents({
    roomId,
    recentEventId,
    limit = 100
  }: {
    roomId: string, 
    recentEventId: string,
    limit?: number
  }) {
    const url = `/_matrix/client/r0/rooms/${encodeURIComponent(roomId)}/context/${encodeURIComponent(recentEventId)}?limit=${limit}`;

    const fetchResponse = await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._client.getAccessToken()}`
      }
    });
    const data = await fetchResponse.json();

    return data.events_after;
  }

  private fetch(path: string, options?: RequestInit): Promise<Response> {
    const hostname = this._client.getHomeserverUrl();
    const url = [hostname, path].join('').replaceAll('//', '/');
    
    return fetch(url, options);
  }
}

export const matrixClient = new Client();
