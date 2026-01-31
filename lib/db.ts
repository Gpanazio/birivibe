import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"

declare global {
  var cachedPrisma: PrismaClient
}

// Cria cliente Prisma para D1 (Cloudflare)
export function createPrismaD1(db: D1Database) {
  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}

// Cliente Prisma para desenvolvimento local (SQLite)
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  // Em produção, o cliente Prisma é criado sob demanda com o D1 adapter.
  // Acessar `db` diretamente em produção não é suportado e lançará um erro.
  prisma = new Proxy({}, {
    get: () => {
      throw new Error("Em produção, use createPrismaD1(env.DB) para obter uma instância do Prisma.")
    }
  }) as PrismaClient
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
