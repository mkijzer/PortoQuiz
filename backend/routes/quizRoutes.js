// quizRoutes.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const questionsPath = path.join(process.cwd(), "data", "questions.json");

// Route to get random questions
router.get("/questions", (req, res) => {
  const count = parseInt(req.query.count) || 5;

  // Read the questions.json file
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

// Other routes for scores (if you have them here)
const scores = []; // Temporary array to store scores

// Route to submit a score
router.post("/scores", (req, res) => {
  const { name, score, timeTaken } = req.body;
  if (name && score !== undefined && timeTaken !== undefined) {
    scores.push({ name, score, timeTaken });
    scores.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
    res.status(201).json({ message: "Score submitted successfully" });
  } else {
    res.status(400).json({ message: "Invalid score data" });
  }
});

// Route to retrieve top scores
router.get("/scores", (req, res) => {
  res.json(scores.slice(0, 5)); // Return only the top 5 scores
});

export default router;
