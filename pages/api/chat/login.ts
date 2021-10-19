import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

import { getEnv, getServerEnv } from '../../../lib/get-env';
import { createToken } from '../../../lib/jwt';

export type LoginResponse = {
  "user_id": string;
  "access_token": string;
  "device_id": string;
  "home_server": string;
  "well_known"?: {
    "m.homeserver"?: {
      "base_url": string
    }
  }
}

const MATRIX_LOGIN_URL = '/_matrix/client/r0/login';

const getPassword = (userId: string): string => {
  const env = getServerEnv();

  if (env.matrixUser1Id === userId) {
    return env.matrixUser1Password
  }
  
  if (env.matrixUser2Id === userId) {
    return env.matrixUser2Password
  }

  return '';
}

export async function matrixLogin(userId: string): Promise<LoginResponse > {
  const url = [getEnv().matrixServerUrl, MATRIX_LOGIN_URL].join('');

  const loginResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "type": "m.login.password",
      "user": userId,
      "password": getPassword(userId),
    })
  });

  const loginData = await loginResponse.json();

  return loginData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  try {
    const tokenData = await matrixLogin(req.body.userId);

    cookies.set('matrix-token', createToken(tokenData), {
      httpOnly: true,
      domain: getServerEnv().hostname.includes('localhost') ? undefined : getServerEnv().hostname,
      sameSite: 'lax'
    });

    res.status(200).json(tokenData);
  } catch (err) {
    const _err = err as Error;
    res.status(500).json({ error: _err.stack ?? _err.message })
  }
}
