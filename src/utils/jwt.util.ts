import * as jwt from 'jsonwebtoken';
import { User } from '../db/schema/users';
import { AppConstant } from './app-constant';
import { DataStoredInToken } from '../types/commons';

const OneMinuteInSeconds = 60;
const secret = AppConstant.JWT_SECRET!;
const expiresIn = AppConstant.JWT_EXPIRED_TIME * OneMinuteInSeconds;
const refreshExpiresIn = 2 * 24 * 60 * OneMinuteInSeconds; // * 2 days

export const createJwtToken = (uuid: string, expiresIn: number) => {
  const data: DataStoredInToken = {
    _uuid: uuid,
  };

  return jwt.sign(data, secret, { expiresIn });
};

export const createToken = (user: User) => {
  return {
    token: createJwtToken(user.uuid!, expiresIn),
    refreshToken: createJwtToken(user.uuid!, refreshExpiresIn),
  };
};

export const verifyToken = (token: string): DataStoredInToken =>
  jwt.verify(token, secret) as DataStoredInToken;
