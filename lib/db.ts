import { PrismaClient } from "@prisma/client"

declare global {
  var cachedPrisma: PrismaClient
}

// Cliente Prisma (singleton pattern para desenvolvimento)
let prisma: PrismaClient

// Cria um proxy recursivo para lidar com chamadas encadeadas como db.user.findFirst()
const createBuildProxy = (): any => {
  return new Proxy(() => { }, {
    get: () => createBuildProxy(),
    apply: () => {
      throw new Error("Prisma cannot be accessed during build phase");
    },
  });
};

import { PrismaD1 } from '@prisma/adapter-d1'
import { getRequestContext } from '@cloudflare/next-on-pages'

if (process.env.NODE_ENV === "production") {
  // If we are in the build phase, always use the proxy to avoid initialization errors
  if (process.env.NEXT_PHASE === "phase-production-build") {
    prisma = createBuildProxy() as PrismaClient;
  } else {
    // Runtime check
    const isEdge = process.env.NEXT_RUNTIME === 'edge';

    if (isEdge) {
      try {
        const adapter = new PrismaD1((getRequestContext().env as any).BIRILIFE)
        prisma = new PrismaClient({ adapter })
      } catch (e) {
        console.warn("Failed to initialize PrismaD1, falling back to proxy or default.", e)
        prisma = createBuildProxy() as PrismaClient;
      }
    } else {
      // Node.js runtime fallback
      if (!process.env.DATABASE_URL) {
        prisma = createBuildProxy() as PrismaClient;
      } else {
        prisma = new PrismaClient()
      }
    }
  }
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
