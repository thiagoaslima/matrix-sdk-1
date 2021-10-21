import { timestampMs } from './common';
export interface Room {
  id: string;
  name: string;
  topic?: string;
  canonicalAlias?: string;
  members?: {
    list: RoomMember[],
    total: number,
  }
  events?: {
    all: RoomEvent[];
  }
}

export interface RoomMember {
  id: string;
  name: string;
}

export interface RoomEvent {
  id: string
  type: string;
  content: any;
  roomId: string;
  sender: string;
  serverTimestamp: timestampMs;
}
