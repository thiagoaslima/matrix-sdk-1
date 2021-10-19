export interface User {
  id: string;
  displayName: string;
  avatarUrl: string;
  status: {
    message: string;
  }
}