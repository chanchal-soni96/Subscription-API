// This file tests the complete subscription workflow.

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";

import request from "supertest";
import app from "../../src/app.js";

import { pool } from "../../src/config/database.js";
import { testPool } from "../../src/config/testDatabase.js";
import { initDatabase } from "../../src/config/initDatabase.js";

describe("Subscription API - End-to-End Tests", () => {
  beforeAll(async () => {
    await initDatabase();
  });

  beforeEach(async () => {
    await testPool.query(
      "TRUNCATE TABLE subscriptions RESTART IDENTITY"
    );
  });

  afterAll(async () => {
    await Promise.all([
      pool.end(),
      testPool.end(),
    ]);
  });

  it("should complete the subscription workflow", async () => {
    // Step 1: Check API liveness
    const liveResponse = await request(app)
      .get("/health/live");

    expect(liveResponse.status).toBe(200);
    expect(liveResponse.body).toEqual({
      status: "ok",
    });

    // Step 2: Check database readiness
    const readyResponse = await request(app)
      .get("/health/ready");

    expect(readyResponse.status).toBe(200);
    expect(readyResponse.body).toEqual({
      status: "ready",
      database: "connected",
    });

    // Step 3: Create a subscription
    const subscriptionData = {
      userId: "e2e-user-001",
      plan: "monthly",
      email: "e2e@example.com",
    };

    const createResponse = await request(app)
      .post("/api/subscriptions")
      .send(subscriptionData);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);

    expect(createResponse.body.data).toMatchObject({
      ...subscriptionData,
      status: "active",
    });

    // Step 4: Verify the record in PostgreSQL
    const databaseResult = await testPool.query(
      `SELECT user_id, plan, email, status
       FROM subscriptions
       WHERE user_id = $1`,
      ["e2e-user-001"]
    );

    expect(databaseResult.rows).toHaveLength(1);

    expect(databaseResult.rows[0]).toEqual({
      user_id: "e2e-user-001",
      plan: "monthly",
      email: "e2e@example.com",
      status: "active",
    });
  });

  it("should reject a subscription with an invalid plan", async () => {
    const response = await request(app)
      .post("/api/subscriptions")
      .send({
        userId: "e2e-user-002",
        plan: "weekly",
        email: "e2e@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
