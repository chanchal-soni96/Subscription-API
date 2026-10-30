import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  vi,
} from "vitest";

import request from "supertest";
import app from "../src/app.js";

import { testPool } from "../src/config/testDatabase.js";
import { initDatabase } from "../src/config/initDatabase.js";
import { pool } from "../src/config/database.js";

// Database setup
beforeAll(async () => {
  await initDatabase();
});

// Clean database before every test
beforeEach(async () => {
  await testPool.query("TRUNCATE TABLE subscriptions RESTART IDENTITY");
});

// Close database connections
afterAll(async () => {
  await Promise.all([pool.end(), testPool.end()]);
});

// 1. Health endpoint tests
describe("GET / integration tests", () => {
  it("should return the API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Subscription API is running",
    });
  });

  it("should return 503 when the database is unavailable", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("Database unavailable"));

    const errorLogSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await request(app).get("/health/ready");

      expect(response.status).toBe(503);

      expect(response.body).toEqual({
        status: "not_ready",
        database: "disconnected",
      });

      expect(querySpy).toHaveBeenCalledWith("SELECT 1");
    } finally {
      querySpy.mockRestore();
      errorLogSpy.mockRestore();
    }
  });
});

// 2. Subscription endpoint integration tests
describe("POST /api/subscriptions integration tests", () => {
  it("should start with an empty subscriptions table", async () => {
    const result = await testPool.query(
      "SELECT COUNT(*)::int AS count FROM subscriptions",
    );

    expect(result.rows[0].count).toBe(0);
  });

  it("should create a subscription with valid data", async () => {
    const subscriptionData = {
      userId: "user123",
      plan: "monthly",
      email: "user@example.com",
    };

    const response = await request(app)
      .post("/api/subscriptions")
      .send(subscriptionData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toMatchObject({
      ...subscriptionData,
      status: "active",
    });

    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.createdAt).toBeDefined();
  });

  it("should reject an invalid subscription plan", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      plan: "weekly",
      email: "user@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject an invalid email address", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      plan: "monthly",
      email: "invalid-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject an empty request body", async () => {
    const response = await request(app).post("/api/subscriptions").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject a userId with the wrong data type", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: 123,
      plan: "monthly",
      email: "user@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject an empty userId", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "",
      plan: "monthly",
      email: "user@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject a request with a missing email", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      plan: "monthly",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject a request with a missing userId", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      plan: "monthly",
      email: "user@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject a request with a missing plan", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      email: "user@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject an empty email", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      plan: "monthly",
      email: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject an email with the wrong data type", async () => {
    const response = await request(app).post("/api/subscriptions").send({
      userId: "user123",
      plan: "monthly",
      email: 123,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 500 when the database insertion fails", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("Database insertion failed"));

    const errorLogSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await request(app).post("/api/subscriptions").send({
        userId: "user123",
        plan: "monthly",
        email: "user@example.com",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal server error",
      });

      expect(querySpy).toHaveBeenCalled();
    } finally {
      querySpy.mockRestore();
      errorLogSpy.mockRestore();
    }
  });
});

// 3. OpenAPI documentation tests
describe("GET /openapi.json integration tests", () => {
  it("should return the OpenAPI specification", async () => {
    const response = await request(app).get("/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBeDefined();
    expect(response.body.info.title).toBe("Subscription API");
  });
});
