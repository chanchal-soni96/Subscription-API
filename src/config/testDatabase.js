
import pg from "pg";

const { Pool } = pg;

export const testPool = new Pool({
  host: "localhost",
  port: 5433,
  database: "subscription_test",
  user: "test_user",
  password: "test_password",
});
