
import { testPool } from "./testDatabase.js";
export async function initDatabase() {
  await testPool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(100) NOT NULL,
      plan VARCHAR(20) NOT NULL
        CHECK (plan IN ('monthly', 'yearly')),
      email VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'cancelled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("Subscriptions table is ready.");
}
