import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const sql = neon(DATABASE_URL)
export const db = drizzle(sql, { schema })
export { schema }
