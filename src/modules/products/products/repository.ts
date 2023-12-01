import db from '../../../db';
import { and, eq } from 'drizzle-orm';
import { newProduct, product, products } from '../../../db/schema/product';

export class ProductRepository {
  getProducts = async () => db.select().from(products).where(eq(products.isActive, true));
  getProductById = async (id: number) =>
    db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.isActive, true)));
  getProductByName = async (name: string) =>
    db
      .select()
      .from(products)
      .where(and(eq(products.name, name), eq(products.isActive, true)));
  createProduct = async (product: newProduct) =>
    db.insert(products).values(product).returning({
      id: products.id,
      name: products.name,
      productCategoryId: products.productCategoryId,
    });
  updateProduct = async (id: number, product: product) =>
    db.update(products).set(product).where(eq(products.id, id)).returning({
      id: products.id,
      name: products.name,
      productCategoryId: products.productCategoryId,
    });
  softDeleteProduct = async (id: number) =>
    db.update(products).set({ isActive: false }).where(eq(products.id, id));
}
