import type { FastifyInstance, HTTPMethods } from "fastify";
import type { CommercialFeatureId } from "@riskdelta/types";

type CommercialRoute = {
  method: HTTPMethods;
  url: string;
};

export function registerCommercialPlaceholderRoutes(
  app: FastifyInstance,
  feature: CommercialFeatureId,
  routes: CommercialRoute[],
) {
  for (const route of routes) {
    app.route({
      method: route.method,
      url: route.url,
      handler: async (_request, reply) =>
        reply.status(403).send({
          error: `${feature} is reserved for the RiskDelta commercial edition.`,
          edition: "community-source-available",
          feature,
        }),
    });
  }
}
