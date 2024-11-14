import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initializeDatabase() {
  const db = await open({
    filename: "scores.db",
    driver: sqlite3.Database,
  });

  // Create a table for scores if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      score INTEGER,
      timeTaken INTEGER
    );
  `);

  return db;
}

export default initializeDatabase;
