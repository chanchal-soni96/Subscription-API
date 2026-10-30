import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const subscriptionResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    plan: z.enum(["monthly", "yearly"]),
    email: z.string().email(),
    status: z.enum(["active", "cancelled"]),
  })
  .openapi("SubscriptionResponse");