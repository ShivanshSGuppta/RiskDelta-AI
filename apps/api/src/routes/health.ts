import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/healthz", async () => ({
    ok: true,
    service: "riskdelta-api",
    timestamp: new Date().toISOString(),
  }));
}
