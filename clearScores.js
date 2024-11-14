import initializeDatabase from "./scores_test.js";

(async () => {
  const db = await initializeDatabase();
  await db.exec(`DROP TABLE IF EXISTS scores`);
  await db.exec(`
    CREATE TABLE scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      score INTEGER,
      timeTaken INTEGER
    );
  `);
  console.log("Scores cleared.");
  await db.close();
})();
