
import { Router } from "express";
import { pool } from "../config/database.js";

const healthRouter = Router();

// Liveness check
healthRouter.get("/live", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

// Readiness check
healthRouter.get("/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ready",
      database: "connected",
    });
  } catch (error) {
    console.error("Readiness check failed:", error.message);

    return res.status(503).json({
      status: "not_ready",
      database: "disconnected",
    });
  }
});

export default healthRouter;
