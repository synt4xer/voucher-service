import { User } from '../db/schema/users';
import { Request } from 'express';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DataStoredInToken {
  _id: string;
}

export interface RequestWithUser extends Request {
  user?: User;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
