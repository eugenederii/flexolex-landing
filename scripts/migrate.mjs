// Applies db/schema.sql against DATABASE_URL. Idempotent — safe to re-run.
// Usage: npm run db:migrate   (reads DATABASE_URL from the environment; see .env.example)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Export it or add it to .env.local and re-run with:");
    console.error("  set -a; source .env.local; set +a; npm run db:migrate");
    process.exit(1);
  }

  const isLocal = /(^|@)(localhost|127\.0\.0\.1)([:/]|$)/.test(connectionString);
  const client = new Client({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });

  const sql = readFileSync(schemaPath, "utf8");

  await client.connect();
  try {
    await client.query(sql);
    console.log("Migration applied successfully (leads, ezaff_status_events).");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
