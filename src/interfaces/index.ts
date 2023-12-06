import { Request } from 'express';

// * create my own type user for single object
type User = {
  uuid: string;
  name: string;
  email: string;
  phone: string;
};

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DataStoredInToken {
  _uuid: string;
}

export interface RequestWithUser extends Request {
  user?: User;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

// * Inventory update payload
export interface RequestUpdateInventory {
  stocks: number;
  operations: string;
}
