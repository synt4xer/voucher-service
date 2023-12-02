import {
    integer,
    index,
    pgTable,
    serial,
  } from 'drizzle-orm/pg-core';
  import { products } from './product';
  
  export const inventories = pgTable(
    'inventory',
    {
      id: serial('id').primaryKey(),
      productId: integer('product_id')
        .notNull()
        .references(() => products.id),
      qtyAvail: integer('qty_avail').notNull().default(0),
      qtyOnHand: integer('qty_on_hand').notNull().default(0),
      qtySettled: integer('qty_settled').notNull().default(0),
      qtyTotal: integer('qty_total').notNull().default(0),
    },
    (table) => {
      return {
        inventoryIdIdx: index('inventory_id_idx').on(table.id),
      };
    },
  );
  
  export type inventory = typeof inventories.$inferSelect;
  export type newInventory = typeof inventories.$inferInsert;
  