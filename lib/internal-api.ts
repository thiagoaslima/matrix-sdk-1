import { getEnv } from './get-env';

const hostname = getEnv().hostname;

export class InternalAPI {
  static url(path: string): string {
    if (!path.startsWith('/')) {
      throw new Error(`Path parameter must start with a /`);
    }

    if (hostname.includes('vercel.app')) {
      return `/api${path}`
    }
    
    return `${hostname}/api${path}`;
  }
}