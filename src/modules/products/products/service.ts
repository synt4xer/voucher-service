import _ from 'lodash';
import { ProductRepository } from './repository';
import { NewProduct, Product } from '../../../db/schema/product';
import { ProductAlreadyExistsException } from '../../../exceptions/bad-request.exception';

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  // * read
  getAll = async () => {
    const data = await this.repository.getProducts();

    return _.chain(data)
      .groupBy('categoryName')
      .map((products, category) => ({ category, products }));
  };
  // * search
  searchByName = async (name: string) => {
    const data = await this.repository.searchProductByName(name);

    return _.chain(data)
      .groupBy('categoryName')
      .map((products, category) => ({ category, products }));
  };
  // * get one
  getOne = async (id: number) => this.repository.getProductById(id);
  // * create
  create = async (product: NewProduct) => {
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
  update = async (product: Product, id: number) => this.repository.updateProduct(id, product);
  // * delete
  delete = async (id: number) => {
    try {
      await this.repository.softDeleteProduct(id);
    } catch (error) {
      throw error;
    }
  };
}
