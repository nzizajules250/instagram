import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Use a connection string for PostgreSQL
// In development, you can use a local PostgreSQL instance or a cloud provider
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/instagram_clone'

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool, { schema })

export * from './schema'
