import { InternalAPI } from "../../../../lib/internal-api";

export type LoginRawResponse = {
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

export type LoginResponse = {
  userId: string;
  deviceId: string;
  accessToken: string;
  homeServerDomain: string;
}

const adaptLoginResponse = (loginData: LoginRawResponse): LoginResponse => ({
  userId: loginData['user_id'],
  deviceId: loginData['device_id'],
  accessToken: loginData['access_token'],
  homeServerDomain: loginData['home_server']
});

const login = async (userId: string) => {
  const url = InternalAPI.url('/chat/login');
  
  const loginResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  const loginData: LoginRawResponse = await loginResponse.json();
  
  if (loginResponse.status === 200) {  
    return adaptLoginResponse(loginData);
  } else {
    console.error(loginData)
    throw new Error('Unable to login');
  }
}

const logout = async (userId: string) => {
  const url = InternalAPI.url('/chat/logout');
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch {
    throw new Error('Unable to logout')
  }
}

export { 
  login, 
  logout 
}
