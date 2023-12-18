import {
  index,
  integer,
  json,
  numeric,
  pgTable,
  serial,
  uniqueIndex,
  uuid,
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
    orderNumber: uuid('order_number').defaultRandom().notNull(),
    status: varchar('status', { length: 15 }).notNull().default('CREATED'),
    paymentCode: varchar('payment_code', { length: 20 }).notNull(),
    shipmentCode: varchar('shipment_code', { length: 20 }).notNull(),
    total: numeric('total').notNull(),
    discount: numeric('discount_amount').notNull().default('0'),
    shipmentDiscount: numeric('shipment_discount').notNull().default('0'),
    shipmentAmount: numeric('shipment_amount').notNull().default('0'),
    grandTotal: numeric('grand_total').notNull().default('0'),
    shipmentMeta: json('shipment_meta'),
    voucherMeta: json('voucher_meta'),
    paymentMeta: json('payment_meta'),
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
