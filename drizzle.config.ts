import { defineConfig, Config } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/lib/schema/index.ts',

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config)
