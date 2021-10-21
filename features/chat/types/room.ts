import { timestampMs } from './common';
import { MessageContent } from './message';

export interface Room {
  id: string;
  name: string;
  topic?: string;
  canonicalAlias?: string;
  members?: {
    list: RoomMember[],
    total: number,
  }
}

export interface RoomMember {
  id: string;
  name: string;
}

export interface RoomEvent<TContent extends MessageContent = any> {
  id: string
  type: string;
  content: TContent;
  roomId: string;
  sender: string;
  serverTimestamp: timestampMs;
}
