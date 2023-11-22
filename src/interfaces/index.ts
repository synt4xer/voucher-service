import { User } from "../db/schema/users";
import { Request } from "express";

export interface APIResponseBodySuccess<T = null> {
  success: true;
  result: T;
  error: null;
}

export interface APIResponseBodyFailure<T> {
  success: false;
  result: null;
  error: T;
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
