import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

/* ==========================================================================
   DATABASE — server-only Postgres connection (raw `pg`, no ORM)
   --------------------------------------------------------------------------
   A small, single pool shared across invocations of the same warm
   serverless instance. `DATABASE_URL` should be a Postgres-compatible
   pooled connection string (e.g. Neon's `-pooler` host, or Vercel
   Postgres's provided URL) — see .env.example. Never imported into client
   code; the `server-only` import above turns an accidental client import
   into a build error, same as lib/ezaff.ts.
   ========================================================================== */

let pool: Pool | undefined;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — see .env.example.");
  }

  // Local Postgres (dev/testing) typically has no TLS listener; hosted
  // providers (Neon, Vercel Postgres) require it.
  const isLocal = /(^|@)(localhost|127\.0\.0\.1)([:/]|$)/.test(connectionString);

  pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    max: 5,
  });

  return pool;
}

/** Runs one query against the pool. Never logs `text`/`params` — callers own safe logging. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

/**
 * Runs `fn` inside a single BEGIN/COMMIT transaction on one checked-out
 * client, rolling back on any error. Use this whenever more than one
 * statement must succeed or fail together (see lib/leadStore.ts).
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
