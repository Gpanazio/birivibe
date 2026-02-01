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

if (process.env.NODE_ENV === "production") {
  // No Cloudflare, durante o build, o D1 não está disponível.
  // Se tentarmos instanciar o PrismaClient sem DATABASE_URL, o build falha.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    prisma = createBuildProxy() as PrismaClient;
  } else {
    prisma = new PrismaClient()
  }
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
