import { PrismaClient } from "@prisma/client"

declare global {
  var cachedPrisma: PrismaClient
}

// Cliente Prisma (singleton pattern para desenvolvimento)
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // No Cloudflare, o D1 no est disponvel durante o build, ento evitamos erros
  if (process.env.NEXT_PHASE === "phase-production-build") {
    prisma = {} as any
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient()
    }
    prisma = global.cachedPrisma
  }
}

export const db = prisma
