import _ from 'lodash';
import { ProductCategoryRepository } from './repository';
import { NewProductCategory, ProductCategory } from '../../../db/schema/product-category';
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
  create = async (productCategory: NewProductCategory) => {
    try {
      const existingCategory = await this.repository.getProductCategoryByName(productCategory.name);

      if (!_.isEmpty(existingCategory)) {
        throw new ProductCategoryAlreadyExistsException(productCategory.name);
      }

      return this.repository.createProductCategory(productCategory);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (productCategory: ProductCategory, id: number) =>
    this.repository.updateProductCategory(id, productCategory);
  // * delete
  delete = async (id: number) => {
    try {
      await this.repository.softDeleteProductCategory(id);
    } catch (error) {
      throw error;
    }
  };
}
