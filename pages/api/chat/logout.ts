import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerEnv } from "../../../lib/get-env";

const MATRIX_LOGOUT_URL = '/_matrix/client/r0/logout';

export async function matrixLogout(authToken: string): Promise<boolean > {
  const url = [getServerEnv().matrixServerUrl, MATRIX_LOGOUT_URL].join('');
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  });

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  try {
    await matrixLogout(req.body.authToken);

    cookies.set('matrix-token', 'removed', {
      expires: new Date(0),
      maxAge: -1,
      httpOnly: true,
      domain: getServerEnv().hostname.includes('localhost') ? undefined : getServerEnv().hostname,
      sameSite: 'lax'
    });

    res.status(200).json({ response: 'success' });
  } catch (err) {
    const _err = err as Error;
    res.status(500).json({ error: _err.stack ?? _err.message })
  }
}