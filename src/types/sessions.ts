import { EffectType } from './commons';

export enum SessionState {
  OPEN = 'open',
  CLOSED = 'closed',
}

export type VoucherAttr = {
  voucherCode: string;
  tnc: string;
};

export type EffectAttr = {
  voucherCode: string;
  effectType: EffectType;
  value: number;
};

export type VoucherListAttr = {
  applied: VoucherAttr[];
  available: VoucherAttr[];
  unavailable: VoucherAttr[];
};

export type CartAttr = {
  productId: number;
  productCategoryId: number;
  productName: string;
  image?: string;
  qty: number;
  price: number;
};

export type CustomerSession = {
  sessionId?: string;
  userId: number;
  state: string;
  carts: CartAttr[];
  attributes: Record<string, any>;
  vouchers: VoucherListAttr;
  effects?: EffectAttr[];
};
