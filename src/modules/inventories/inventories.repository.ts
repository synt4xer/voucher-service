import db from '../../db';
import { and, eq } from 'drizzle-orm';
import { products } from '../../db/schema/product';
import { RequestUpdateInventory } from '../../types/interfaces';
import { Inventory, inventories } from '../../db/schema/inventory';

export class InventoryRepository {
  getInventories = async () =>
    db
      .select({
        id: inventories.id,
        productId: inventories.productId,
        productName: products.name,
        qtyAvail: inventories.qtyAvail,
        qtySettled: inventories.qtySettled,
        qtyTotal: inventories.qtyTotal,
      })
      .from(inventories)
      .leftJoin(products, eq(products.id, inventories.productId));
  getInventoryById = async (id: number) =>
    db
      .select()
      .from(inventories)
      .where(and(eq(inventories.id, id)));
  getInventoryByProductId = async (productId: number) =>
    db
      .select()
      .from(inventories)
      .where(and(eq(inventories.productId, productId)))
      .limit(1);
  addStock = async (
    productId: number,
    payload: RequestUpdateInventory,
    existingInventory: Inventory,
  ) => {
    const data = {
      qtyAvail: existingInventory.qtyAvail + payload.stocks,
      qtyTotal: existingInventory.qtyTotal + payload.stocks,
    };

    return db.update(inventories).set(data).where(eq(inventories.productId, productId)).returning({
      id: inventories.id,
      productId: inventories.productId,
      qtyAvail: inventories.qtyAvail,
      qtyTotal: inventories.qtyTotal,
    });
  };
  reduceStock = async (
    productId: number,
    payload: RequestUpdateInventory,
    existingInventory: Inventory,
  ) => {
    const data = {
      qtyAvail: existingInventory.qtyAvail - payload.stocks,
      qtyTotal: existingInventory.qtyTotal - payload.stocks,
    };

    return db.update(inventories).set(data).where(eq(inventories.productId, productId)).returning({
      id: inventories.id,
      productId: inventories.productId,
      qtyAvail: inventories.qtyAvail,
      qtyTotal: inventories.qtyTotal,
    });
  };
}
