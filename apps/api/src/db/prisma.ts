import { PrismaClient } from "@prisma/client";
import { loadApiEnv } from "@riskdelta/config";

declare global {
  // eslint-disable-next-line no-var
  var __riskdeltaApiPrisma: PrismaClient | undefined;
}

const env = loadApiEnv();

export const prisma =
  global.__riskdeltaApiPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__riskdeltaApiPrisma = prisma;
}
