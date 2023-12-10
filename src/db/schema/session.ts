import {
  index,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const sessions = pgTable(
  'session',
  {
    id: serial('id').primaryKey(),
    sessionId: uuid('session_id').defaultRandom().notNull(),
    userId: integer('user_id').notNull(),
    state: varchar('state').notNull().default('open'),
    data: json('data'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      sessionIdIdx: index('session_id_idx').on(table.id),
    };
  },
);
