import {
  boolean,
  decimal,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const vouchers = pgTable(
  'voucher',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 25 }).notNull(),
    effect: varchar('effect', { length: 25 }).notNull(),
    activeFrom: timestamp('active_from', { mode: 'string' }).notNull(),
    activeTo: timestamp('active_to', { mode: 'string' }).notNull(),
    quota: integer('quota').notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    value: numeric('value').notNull(),
    maxValue: numeric('max_value').notNull(),
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

export type Voucher = typeof vouchers.$inferSelect;
export type NewVoucher = typeof vouchers.$inferInsert;
