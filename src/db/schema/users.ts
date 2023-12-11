import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    dob: date('date_of_birth').notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 15 }).notNull(),
    address: text('address').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    createdBy: serial('created_by').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
    updatedBy: serial('updated_by').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.id),
      nameIdx: index('name_idx').on(table.name),
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
