import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    dob: date('date_of_birth').notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 15 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdBy: serial('created_by').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    updatedBy: serial('updated_by').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      nameIdx: index('name_idx').on(table.name),
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
