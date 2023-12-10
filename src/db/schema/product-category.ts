import {
  boolean,
  index,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const productCategories = pgTable(
  'product_category',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    description: varchar('description', { length: 256 }),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    createdBy: serial('created_by').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
    updatedBy: serial('updated_by').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      productCategoryIdIdx: index('product_category_id_idx').on(table.id),
      nameIdx: uniqueIndex('category_name_idx').on(table.name),
    };
  },
);

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
