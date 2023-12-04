import db from '../../../db';
import { and, eq } from 'drizzle-orm';
import { NewInventory, Inventory, inventories } from '../../../db/schema/inventory';
import { RequestUpdateInventory } from '../../../interfaces';

export class InventoryRepository {
  getInventories = async () => db.select().from(inventories);
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
  addStock = async (productId: number, payload: RequestUpdateInventory, existingInventory: Inventory) => {
        const data = {
            qtyAvail: existingInventory.qtyAvail + payload.stocks,
            qtyTotal: existingInventory.qtyTotal + payload.stocks
        }
       
        return await db.update(inventories).set(data).where(eq(inventories.productId, productId)).returning({
        id: inventories.id,
        productId: inventories.productId,
        qtyAvail: inventories.qtyAvail,
        qtyTotal: inventories.qtyTotal,
        });
    }
  reduceStock = async (productId: number, payload: RequestUpdateInventory, existingInventory: Inventory) => {
        const data = {
            qtyAvail: existingInventory.qtyAvail - payload.stocks,
            qtyTotal: existingInventory.qtyTotal - payload.stocks
        }
    
        return await db.update(inventories).set(data).where(eq(inventories.productId, productId)).returning({
        id: inventories.id,
        productId: inventories.productId,
        qtyAvail: inventories.qtyAvail,
        qtyTotal: inventories.qtyTotal,
        });
    }
}
