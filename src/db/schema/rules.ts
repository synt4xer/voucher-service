import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const rules = pgTable(
  'rules',
  {
    id: serial('id').primaryKey(),
    nodeType: varchar('node_type', { length: 25 }).notNull(),
    nodeId: integer('node_id').notNull(),
    key: varchar('key', { length: 50 }).notNull(),
    operatorFn: varchar('operator_fn', { length: 20 }).notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    value: varchar('value', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      ruleIdIdx: index('rule_id_idx').on(table.id),
    };
  },
);

export type Rule = typeof rules.$inferSelect;
export type NewRule = typeof rules.$inferInsert;
