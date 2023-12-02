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
import { productCategories } from './product-category';

export const products = pgTable(
  'product',
  {
    id: serial('id').primaryKey(),
    productCategoryId: integer('product_category_id')
      .notNull()
      .references(() => productCategories.id),
    name: varchar('name', { length: 256 }).notNull(),
    image: varchar('image'),
    description: varchar('description', { length: 256 }),
    price: decimal('price').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdBy: serial('created_by').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    updatedBy: serial('updated_by').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      productIdIdx: index('product_id_idx').on(table.id),
      nameIdx: uniqueIndex('product_name_idx').on(table.name),
    };
  },
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
