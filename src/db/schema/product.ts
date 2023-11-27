import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
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
    description: varchar('description', { length: 256 }).notNull(),
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
      nameIdx: index('product_name_idx').on(table.name),
    };
  },
);

export type product = typeof products.$inferSelect;
export type newProduct = typeof products.$inferInsert;
