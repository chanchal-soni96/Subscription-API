import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { createSubscriptionSchema } from "../schemas/subscriptionSchema.js";
import { subscriptionResponseSchema } from "../schemas/subscriptionResponseSchema.js";

const registry = new OpenAPIRegistry();

registry.register("CreateSubscriptionRequest", createSubscriptionSchema);
registry.register("SubscriptionResponse", subscriptionResponseSchema);

registry.registerPath({
  method: "get",
  path: "/health/live",
  summary: "Check API liveness",
  description: "Checks whether the API process is running.",
  responses: {
    200: {
      description: "API is alive",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "ok",
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/health/ready",
  summary: "Check API readiness",
  description: "Checks whether the API can communicate with PostgreSQL.",
  responses: {
    200: {
      description: "API and database are ready",
    },
    503: {
      description: "API is not ready",
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Subscription API",
    version: "1.0.0",
    description: "API for managing user subscriptions",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],

  
});