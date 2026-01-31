import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"

declare global {
  var cachedPrisma: PrismaClient
}

// Tipo para o ambiente Cloudflare
export interface CloudflareEnv {
  DB: D1Database
}

// Cria cliente Prisma para D1 (Cloudflare)
export function createPrismaD1(db: D1Database) {
  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}

// Cliente Prisma para desenvolvimento local (SQLite)
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  // Em produção, o cliente será criado via createPrismaD1
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
