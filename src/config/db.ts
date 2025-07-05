import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on("error", (err) => {
  console.error("Unexpected error", err);
  process.exit(-1);
});

export default db;
