import HttpException from './http.exception';

export class ProductInventoryNotFoundException extends HttpException {
  constructor(productId: number) {
    super(404, `Product with id ${productId} not found!`);
  }
}
