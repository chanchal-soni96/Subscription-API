
import { Router } from "express";
import { createSubscriptionSchema } from "../schemas/subscriptionSchema.js";
import { pool } from "../config/database.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", async (req, res) => {
  const validationResult = createSubscriptionSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { userId, plan, email } = validationResult.data;

  try {
      const result = await pool.query(      `INSERT INTO subscriptions (user_id, plan, email)
       VALUES ($1, $2, $3)
       RETURNING id, user_id AS "userId", plan, email, status, created_at AS "createdAt"`,
      [userId, plan, email]
    );

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create subscription:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default subscriptionRouter;
