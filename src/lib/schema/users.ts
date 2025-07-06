import { pgTable, pgEnum, text, timestamp, index } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userStatus = pgEnum('user_status', ['active', 'inactive', 'banned'])

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    status: userStatus('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    lastLogin: timestamp('last_login'),
  },
  t => [
    index('idx_users_status').on(t.status),
    index('idx_users_created_at').on(t.createdAt),
    index('idx_users_last_login').on(t.lastLogin),
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
