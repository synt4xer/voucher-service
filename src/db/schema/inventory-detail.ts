import { index, integer, json, pgTable, serial } from 'drizzle-orm/pg-core';
import { inventories } from './inventory';
import { orderDetails } from './order-detail';

export const inventoryDetails = pgTable(
  'inventory_detail',
  {
    id: serial('id').primaryKey(),
    inventoryId: integer('inventory_id')
      .notNull()
      .references(() => inventories.id),
    orderDetailId: integer('order_detail_id')
      .notNull()
      .references(() => orderDetails.id),
    orderMeta: json('order_meta'),
  },
  (table) => {
    return {
      inventoryDetailIdIdx: index('inventory_detail_id_idx').on(table.id),
    };
  },
);

export type InvetoryDetail = typeof inventoryDetails.$inferSelect;
export type NewInvetoryDetail = typeof inventoryDetails.$inferInsert;
