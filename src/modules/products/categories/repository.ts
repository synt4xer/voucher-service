import { eq } from 'drizzle-orm';
import db from '../../../db';
import {
  newProductCategory,
  productCategories,
  productCategory,
} from '../../../db/schema/product-category';

export class ProductCategoryRepository {
  getProductCategories = async () => db.select().from(productCategories);
  getProductCategoryById = async (id: number) =>
    db.select().from(productCategories).where(eq(productCategories.id, id));
  getProductCategoryByName = async (name: string) =>
    db.select().from(productCategories).where(eq(productCategories.name, name));
  createProductCategory = async (productCategory: newProductCategory) =>
    db
      .insert(productCategories)
      .values(productCategory)
      .returning({ id: productCategories.id, name: productCategories.name });
  updateProductCategory = async (id: number, updateProductCategory: productCategory) =>
    db
      .update(productCategories)
      .set(updateProductCategory)
      .where(eq(productCategories.id, id))
      .returning({ id: productCategories.id, name: productCategories.name });
  softDeleteProductCategory = async (id: number) =>
    db.update(productCategories).set({ isActive: false }).where(eq(productCategories.id, id));
}
