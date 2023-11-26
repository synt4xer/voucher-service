import * as jwt from 'jsonwebtoken';
import { User } from '../db/schema/users';
import { DataStoredInToken } from '../interfaces';
import { AppConstant } from './app-constant';

const OneMinuteInSeconds = 60;
const secret = AppConstant.JWT_SECRET!;

export const createToken = (user: User) => {
  const expiresIn = AppConstant.JWT_EXPIRED_TIME * OneMinuteInSeconds;

  const data: DataStoredInToken = {
    _uuid: user.uuid!,
  };

  return {
    token: jwt.sign(data, secret, { expiresIn }),
    refreshToken: jwt.sign(data, secret, { expiresIn: '2d' }),
  };
};

export const verifyToken = (token: string): DataStoredInToken =>
  jwt.verify(token, secret) as DataStoredInToken;
