import _ from 'lodash';
import { ProductRepository } from './repository';
import { uploadImage } from '../../../utils/imgbb.util';
import { NewProduct, Product } from '../../../db/schema/product';
import { ProductAlreadyExistsException } from '../../../exceptions/bad-request.exception';

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  // * lists
  productLists = async (name?: string) => this.repository.productLists(name);
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
  create = async (product: NewProduct, image: any | null) => {
    try {
      const existingProduct = await this.repository.getProductByName(product.name);

      if (!_.isEmpty(existingProduct)) {
        throw new ProductAlreadyExistsException(product.name);
      }

      const imageUrl = image == null ? null : await uploadImage(image);

      return this.repository.createProduct({ ...product, image: imageUrl });
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (product: Product, image: any | null, id: number) => {
    const imageUrl = image == null ? null : await uploadImage(image);
    return this.repository.updateProduct(id, { ...product, image: imageUrl });
  };
  // * delete
  delete = async (id: number) => {
    try {
      await this.repository.softDeleteProduct(id);
    } catch (error) {
      throw error;
    }
  };
}
