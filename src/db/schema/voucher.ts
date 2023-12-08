import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const voucher = pgTable(
  'voucher',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 10 }).notNull(),
    effect: varchar('effect', { length: 25 }).notNull(),
    activeFrom: timestamp('active_from').notNull(),
    activeTo: timestamp('active_to').notNull(),
    quota: integer('quota').notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    value: decimal('value').notNull(),
    maxValue: decimal('max_value').notNull(),
    tnc: varchar('tnc').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      voucherIdIdx: index('voucher_id_idx').on(table.id),
      codeIdx: uniqueIndex('code_idx').on(table.code),
    };
  },
);

export type Voucher = typeof voucher.$inferSelect;
export type NewVoucher = typeof voucher.$inferInsert;
