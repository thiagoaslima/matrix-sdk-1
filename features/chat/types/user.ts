import { elapsedTimeMs } from './common';

export enum PresenceEnum {
  online = "online",
  offline = "offline",
  unavailable = "unavailable",
}
export interface User {
  id: string;
  displayName: string;
  avatarUrl: string;
  status: {
    /** This user's presence. One of: ["online", "offline", "unavailable"] **/
    presence: PresenceEnum;	
    /** The state message for this user if one was set. **/
    message: string | null;
    /** The length of time in milliseconds since an action was performed by this user. **/
    lastActiveAgo?: elapsedTimeMs;	
    /** Whether the user is currently active **/
    isActive?: boolean	
  }
}