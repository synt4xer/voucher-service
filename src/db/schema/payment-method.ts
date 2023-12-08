import { boolean, index, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const paymentMethod = pgTable(
  'payment_method',
  {
    id: serial('id').primaryKey(),
    code: varchar('payment_code', { length: 25 }).notNull(),
    name: varchar('payment_name', { length: 25 }).notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      paymentMethodIdIdx: index('payment_method_id_idx').on(table.id),
      paymentMethodCodeIdx: uniqueIndex('payment_method_code_idx').on(table.code),
    };
  },
);

export type PaymentMethod = typeof paymentMethod.$inferSelect;
export type NewPaymentMethod = typeof paymentMethod.$inferInsert;
