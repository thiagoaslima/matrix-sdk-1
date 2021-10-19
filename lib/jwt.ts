import { sign, verify } from 'jsonwebtoken';
import { getServerEnv } from './get-env';

const secret = getServerEnv().jwtPasscode;

export const createToken = (payload: any) => {
  return sign(
    payload, 
    secret, 
    {
      algorithm: "HS256",
      expiresIn: "5 days"
    }
  )
};

export const verifyToken = <Resp>(token: string): Resp => {
  const decoded = verify(token, secret)
  return decoded as Resp;
};
