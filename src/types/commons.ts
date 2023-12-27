import { Request } from 'express';

// * create my own type user for single object
type User = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
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

export type ShipmentData = {
  code: string;
  name: string;
  amount: string;
  isActive: boolean | null;
};

type Rule = {
  id: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  type: string;
  value: string;
  nodeType: string;
  nodeId: number;
  key: string;
  operatorFn: string;
};

export type VoucherData = {
  id: number;
  type: string;
  code: string;
  effect: string;
  activeFrom: string;
  activeTo: string;
  quota: number;
  value: string;
  maxValue: string;
  tnc: string;
  isActive: boolean | null;
  rules: Rule[];
};

export type ProductData = {
  id: number;
  productCategoryId: number;
  name: string;
  categoryName: string | null;
  image: string | null;
  description: string | null;
  price: string;
  isActive: boolean | null;
};

export enum EffectType {
  SET_DISCOUNT = 'setDiscount',
  SET_SHIPPING_DISCOUNT = 'setShippingDiscount',
}

export enum NodeType {
  VOUCHER = 'VOUCHER',
  PUSH_NOTIFICATION = 'PUSHNOT',
}

export enum RuleOperator {
  EQ = 'eq',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  SM = 'some',
  EV = 'every',
}
