import { getEnv } from './get-env';

const hostname = getEnv().hostname;

export class InternalAPI {
  static url(path: string): string {
    if (!path.startsWith('/')) {
      throw new Error(`Path parameter must start with a /`);
    }
    
    return `${hostname}/api${path}`;
  }
}