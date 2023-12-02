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

export class ProductInventoryNotFoundException extends HttpException {
  constructor(productId: number) {
    super(400, `Product with id ${productId} not found!`);
  }
}
