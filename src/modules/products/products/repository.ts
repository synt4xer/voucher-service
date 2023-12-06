import db from '../../../db';
import { and, eq } from 'drizzle-orm';
import { productCategories } from '../../../db/schema/product-category';
import { NewProduct, Product, products } from '../../../db/schema/product';
import { inventories } from '../../../db/schema/inventory';

// * selected column
const selectColumn = {
  id: products.id,
  productCategoryId: products.productCategoryId,
  name: products.name,
  categoryName: productCategories.name,
  image: products.image,
  description: products.description,
  price: products.price,
  isActive: products.isActive,
};

// * returned column
const returnedColumn = {
  id: products.id,
  productCategoryId: products.productCategoryId,
  name: products.name,
  image: products.image,
  description: products.description,
  price: products.price,
  isActive: products.isActive,
};

export class ProductRepository {
  getProducts = async () =>
    db
      .select(selectColumn)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .where(eq(products.isActive, true));
  getProductById = async (id: number) =>
    db
      .select(selectColumn)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .where(and(eq(products.id, id), eq(products.isActive, true)));
  getProductByName = async (name: string) =>
    db
      .select()
      .from(products)
      .where(and(eq(products.name, name), eq(products.isActive, true)));

  // * transactional
  createProduct = async (product: NewProduct) => {
    try {
      return await db.transaction(async (tx) => {
        const [newProduct] = await tx.insert(products).values(product).returning(returnedColumn);

        // * insert to inventory
        await tx.insert(inventories).values({ productId: newProduct.id });

        return newProduct;
      });
    } catch (error) {
      throw error;
    }
  };
  updateProduct = async (id: number, product: Product) =>
    db.update(products).set(product).where(eq(products.id, id)).returning(returnedColumn);
  softDeleteProduct = async (id: number) =>
    db.update(products).set({ isActive: false }).where(eq(products.id, id));
}
