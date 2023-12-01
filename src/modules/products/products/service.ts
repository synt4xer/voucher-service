import _ from 'lodash';
import { newProduct, product } from '../../../db/schema/product';
import { ProductAlreadyExistsException } from '../../../exceptions/bad-request.exception';
import { ProductRepository } from './repository';

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  // * read
  getAll = async () => this.repository.getProducts();
  // * get one
  getOne = async (id: number) => this.repository.getProductById(id);
  // * create
  create = async (product: newProduct) => {
    try {
      const existingProduct = await this.repository.getProductByName(product.name);

      if (!_.isEmpty(existingProduct)) {
        throw new ProductAlreadyExistsException(product.name);
      }

      return this.repository.createProduct(product);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (product: product, id: number) => this.repository.updateProduct(id, product);
  // * delete
  delete = async (id: number) => {
    try {
      await this.repository.softDeleteProduct(id);
    } catch (error) {
      throw error;
    }
  };
}
