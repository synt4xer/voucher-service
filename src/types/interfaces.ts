// * Inventory update payload
export interface RequestUpdateInventory {
  stocks: number;
  operations: string;
}

// * Vouchers payload
export interface RulesRequest {
  nodeType: string;
  key: string;
  operatorFn: string;
  type: string;
  value: string;
  nodeId?: number;
}

export interface VoucherWithRules {
  id?: number;
  code: string;
  effect: string;
  activeFrom: string;
  activeTo: string;
  quota: number;
  type: string;
  value: string;
  maxValue: string;
  tnc: string;
  isActive?: boolean;
  rules: RulesRequest[];
}
