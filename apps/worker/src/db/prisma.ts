import { PrismaClient } from "@prisma/client";
import { loadWorkerEnv } from "@riskdelta/config";

declare global {
  // eslint-disable-next-line no-var
  var __riskdeltaWorkerPrisma: PrismaClient | undefined;
}

const env = loadWorkerEnv();

export const prisma =
  global.__riskdeltaWorkerPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__riskdeltaWorkerPrisma = prisma;
}
