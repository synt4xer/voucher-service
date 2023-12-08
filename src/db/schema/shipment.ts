import {
  boolean,
  decimal,
  index,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const shipment = pgTable(
  'shipment',
  {
    id: serial('id').primaryKey(),
    code: varchar('shipment_code', { length: 100 }).notNull(),
    name: varchar('shipment_name', { length: 100 }).notNull(),
    amount: decimal('shipment_amount').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      shipmentIdIdx: index('shipment_id_idx').on(table.id),
      shipmentCodeIdx: uniqueIndex('shipment_code_idx').on(table.code),
      shipmentNameIdx: uniqueIndex('shipment_name_idx').on(table.name),
    };
  },
);

export type Shipment = typeof shipment.$inferSelect;
export type NewShipment = typeof shipment.$inferInsert;
