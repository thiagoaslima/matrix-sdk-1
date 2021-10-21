import { timestampMs } from './common';

export interface Device {
  id: string;
  displayName?: string;
  lastSeenAt?: timestampMs;
}
    