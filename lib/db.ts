import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const pool = new Pool({ connectionString, webSocketConstructor: ws })
const adapter = new PrismaNeon(pool)

const globalForPrisma = global as { prisma?: PrismaClient }

// 防止开发环境下热重载创建多个 PrismaClient 实例
export const db = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
} 