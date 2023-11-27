import * as jwt from 'jsonwebtoken';
import { User } from '../db/schema/users';
import { DataStoredInToken } from '../interfaces';
import { AppConstant } from './app-constant';

const OneMinuteInSeconds = 60;
const secret = AppConstant.JWT_SECRET!;
const expiresIn = AppConstant.JWT_EXPIRED_TIME * OneMinuteInSeconds;

export const createAccessToken = (data: DataStoredInToken) => jwt.sign(data, secret, { expiresIn });

const createRefreshToken = (data: DataStoredInToken) => jwt.sign(data, secret, { expiresIn: '2d' });

export const createToken = (user: User) => {
  const data: DataStoredInToken = {
    _uuid: user.uuid!,
  };

  return {
    token: createAccessToken(data),
    refreshToken: createRefreshToken(data),
  };
};

export const verifyToken = (token: string): DataStoredInToken =>
  jwt.verify(token, secret) as DataStoredInToken;
