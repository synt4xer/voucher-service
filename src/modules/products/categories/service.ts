import _ from 'lodash';
import { ProductCategoryRepository } from './repository';
import { newProductCategory, productCategory } from '../../../db/schema/product-category';
import { ProductCategoryAlreadyExistsException } from '../../../exceptions/bad-request.exception';

export class ProductCategoryService {
  private readonly repository: ProductCategoryRepository;

  constructor() {
    this.repository = new ProductCategoryRepository();
  }

  // * read
  getAll = async () => this.repository.getProductCategories();
  // * get one
  getOne = async (id: number) => this.repository.getProductCategoryById(id);
  // * create
  create = async (productCategory: newProductCategory) => {
    try {
      const existingCategory = await this.repository.getProductCategoryByName(productCategory.name);

      if (_.isEmpty(existingCategory)) {
        throw new ProductCategoryAlreadyExistsException(productCategory.name);
      }

      return this.repository.createProductCategory(productCategory);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (productCategory: productCategory, id: number) =>
    this.repository.updateProductCategory(id, productCategory);
  // * delete
  delete = async (id: number) => {
    try {
      await this.repository.softDeleteProductCategory(id);
      return true;
    } catch (error) {
      throw error;
    }
  };
}
