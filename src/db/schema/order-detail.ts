import { index, integer, json, numeric, pgTable, serial } from 'drizzle-orm/pg-core';
import { products } from './product';
import { orders } from './order';

export const orderDetails = pgTable(
  'order_detail',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    qty: integer('qty').notNull(),
    price: numeric('price').notNull(),
    total: numeric('total').notNull(),
    productMeta: json('product_meta'),
  },
  (table) => {
    return {
      orderDetailIdIdx: index('order_detail_id_idx').on(table.id),
    };
  },
);

export type OrderDetail = typeof orderDetails.$inferSelect;
export type NewOrderDetail = typeof orderDetails.$inferInsert;
