import {
  decimal,
  index,
  integer,
  json,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const orders = pgTable(
  'order',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    orderNumber: varchar('order_number', { length: 16 }).notNull(),
    status: varchar('status', { length: 15 }).notNull().default('CREATED'),
    total: decimal('total').notNull(),
    discountAmount: decimal('discount_amount').notNull().default('0'),
    shipmentAmount: decimal('shipment_amount').notNull().default('0'),
    grandTotal: decimal('grand_total').notNull().default('0'),
    shipmentMeta: json('shipment_meta'),
    voucherMeta: json('voucher_meta'),
  },
  (table) => {
    return {
      orderIdIdx: index('order_id_idx').on(table.id),
      orderNumberIdx: uniqueIndex('order_number_idx').on(table.orderNumber),
    };
  },
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
