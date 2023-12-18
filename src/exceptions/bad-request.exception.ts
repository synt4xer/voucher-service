import HttpException from './http.exception';

export class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists!`);
  }
}

export class ProductCategoryAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Product Category with name ${name} already exists!`);
  }
}

export class ProductAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Product with name ${name} already exists!`);
  }
}

export class PaymentMethodAlreadyExistException extends HttpException {
  constructor(code: string) {
    super(400, `Payment method with code ${code} already exists!`);
  }
}
export class ShipmentAlreadyExistException extends HttpException {
  constructor(code: string) {
    super(400, `Shipment with code ${code} already exists!`);
  }
}

export class VoucherAlreadyExistException extends HttpException {
  constructor(code: string) {
    super(400, `Voucher with code ${code} already exists!`);
  }
}

export class StockInsufficientException extends HttpException {
  constructor() {
    super(400, `Stock insufficient, please update your cart!`);
  }
}
