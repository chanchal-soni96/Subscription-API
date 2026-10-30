import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createSubscriptionSchema = z
  .object({
    userId: z.string().min(1, "User ID is required").openapi({
      example: "user123",
    }),

    plan: z.enum(["monthly", "yearly"]).openapi({
      example: "monthly",
    }),

    email: z.string().email("Invalid email address").openapi({
      example: "user@example.com",
    }),
  })
  .openapi("CreateSubscriptionRequest");