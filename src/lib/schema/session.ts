import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert
