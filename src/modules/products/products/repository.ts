import db from '../../../db';
import { and, eq, gt, inArray, like } from 'drizzle-orm';
import { inventories } from '../../../db/schema/inventory';
import { productCategories } from '../../../db/schema/product-category';
import { NewProduct, Product, products } from '../../../db/schema/product';

// * selected & returned column
const column = {
  id: products.id,
  productCategoryId: products.productCategoryId,
  name: products.name,
  categoryName: productCategories.name,
  image: products.image,
  description: products.description,
  price: products.price,
  isActive: products.isActive,
};

export class ProductRepository {
  productLists = async (name?: string) => {
    if (!name) {
      return db
        .select(column)
        .from(products)
        .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
        .where(eq(products.isActive, true));
    }

    return db
      .select(column)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .where(and(like(products.name, name), eq(products.isActive, true)));
  };
  getProducts = async () =>
    db
      .select(column)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .innerJoin(
        inventories,
        and(eq(inventories.productId, products.id), gt(inventories.qtyAvail, 0)),
      )
      .where(eq(products.isActive, true));
  getProductById = async (id: number) =>
    db
      .select(column)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .where(and(eq(products.id, id), eq(products.isActive, true)));
  getProductByIds = async (ids: number[]) =>
    db
      .select(column)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .where(and(inArray(products.id, ids), eq(products.isActive, true)));
  getProductByName = async (name: string) =>
    db
      .select()
      .from(products)
      .where(and(eq(products.name, name), eq(products.isActive, true)));
  searchProductByName = async (name: string) =>
    db
      .select(column)
      .from(products)
      .leftJoin(productCategories, eq(productCategories.id, products.productCategoryId))
      .innerJoin(
        inventories,
        and(eq(inventories.productId, products.id), gt(inventories.qtyAvail, 0)),
      )
      .where(and(like(products.name, name), eq(products.isActive, true)));

  // * transactional
  createProduct = async (product: NewProduct) => {
    try {
      return await db.transaction(async (tx) => {
        const [newProduct] = await tx.insert(products).values(product).returning(column);

        // * insert to inventory
        await tx.insert(inventories).values({ productId: newProduct.id });

        return newProduct;
      });
    } catch (error) {
      throw error;
    }
  };
  updateProduct = async (id: number, product: Product) =>
    db.update(products).set(product).where(eq(products.id, id)).returning(column);
  softDeleteProduct = async (id: number) =>
    db.update(products).set({ isActive: false }).where(eq(products.id, id));
}
