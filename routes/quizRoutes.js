import express from "express";
import fs from "fs";
import path from "path";
import initializeDatabase from "../database.js";

const router = express.Router();
const questionsPath = path.join(process.cwd(), "data", "questions.json");

let db;
(async () => {
  db = await initializeDatabase();
})();

// Route to get random questions
router.get("/questions", (req, res) => {
  const count = parseInt(req.query.count) || 5;

  fs.readFile(questionsPath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error loading questions" });
      return;
    }

    const questions = JSON.parse(data);
    const selectedQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
    res.json({ questions: selectedQuestions });
  });
});

// Route to submit a score
router.post("/scores", async (req, res) => {
  console.log("Adding score to database:", req.body);
  const { name, score, timeTaken } = req.body;
  if (name && score !== undefined && timeTaken !== undefined) {
    try {
      await db.run(
        `INSERT INTO scores (name, score, timeTaken) VALUES (?, ?, ?)`,
        [name, score, timeTaken]
      );
      res.status(201).json({ message: "Score submitted successfully" });
    } catch (error) {
      console.error("Error saving score:", error);
      res.status(500).json({ message: "Error saving score" });
    }
  } else {
    res.status(400).json({ message: "Invalid score data" });
  }
});

// Route to retrieve top scores
router.get("/scores", async (req, res) => {
  console.log("Fetching scores from database");
  try {
    const scores = await db.all(
      `SELECT name, score, timeTaken FROM scores ORDER BY score DESC, timeTaken ASC LIMIT 5`
    );
    res.json(scores);
  } catch (error) {
    console.error("Error retrieving scores:", error);
    res.status(500).json({ message: "Error retrieving scores" });
  }
});

export default router;
