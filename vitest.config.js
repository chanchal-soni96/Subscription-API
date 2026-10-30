import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DB_HOST: "localhost",
      DB_PORT: "5433",
      DB_NAME: "subscription_test",
      DB_USER: "test_user",
      DB_PASSWORD: "test_password",
    },

    fileParallelism: false,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/routes/**/*.js",
        "src/services/**/*.js",
      ],
      exclude: [
        "src/**/*.test.js",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});