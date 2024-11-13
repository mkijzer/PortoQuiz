// app.js
import {
  startTimer,
  resetTimer,
  startQuizTimer,
  stopQuizTimer,
  formatTime,
} from "./timer.js";

import { submitScore, fetchScores } from "./scoreService.js";

document.addEventListener("DOMContentLoaded", () => {
  const startQuizButton = document.getElementById("start-quiz");
  const quizSection = document.getElementById("quiz");
  const resultsSection = document.getElementById("results");
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const scoreDisplay = document.getElementById("score");
  const scoreboardDisplay = document.getElementById("scoreboard");

  const questionCountModal = document.getElementById("questionCountModal");
  const questionCountButtons = document.querySelectorAll(".question-count");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let questionCount = 10; // Default to 10 questions if not selected

  // Fetch Questions from Backend
  async function fetchQuestions() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/questions?count=${questionCount}`
      );
      const data = await response.json();
      questions = data.questions;
      console.log("Fetched questions:", questions); // Log fetched questions for debugging
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  // Show Question Count Modal on Start
  startQuizButton.addEventListener("click", () => {
    questionCountModal.style.display = "flex"; // Show the question count modal
  });

  // Set Question Count and Start Quiz
  questionCountButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      questionCount = e.target.getAttribute("data-count");
      questionCountModal.style.display = "none"; // Hide the modal
      startQuiz();
    });
  });

  // Start Quiz Function
  async function startQuiz() {
    startQuizTimer();
    await fetchQuestions();
    document.getElementById("body").style.display = "none";
    quizSection.style.display = "block";
    startQuestion();
  }

  // Display Question with Timer
  function startQuestion() {
    if (currentQuestionIndex < questions.length) {
      showQuestion();
      startTimer(handleTimeOut); // Start timer with a callback for timeouts
    } else {
      endQuiz();
    }
  }

  // Display Question
  function showQuestion() {
    resetTimer(); // Reset the timer each time a new question is displayed
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = ""; // Clear previous options
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectAnswer(option));
      optionsContainer.appendChild(button);
    });
  }

  // Handle Answer Selection
  function selectAnswer(selectedOption) {
    resetTimer(); // Reset timer after an answer is selected
    const question = questions[currentQuestionIndex];
    if (selectedOption === question.answer) {
      score++;
    }
    currentQuestionIndex++;
    startQuestion();
  }

  // Handle Timeout (No Answer Selected)
  function handleTimeOut() {
    currentQuestionIndex++;
    startQuestion();
  }

  // End Quiz and Show Results
  async function endQuiz() {
    resetTimer(); // Stop the question timer
    const quizTime = stopQuizTimer(); // Get the total time taken
    quizSection.style.display = "none";
    resultsSection.style.display = "block";
    scoreDisplay.textContent = `Score: ${score}`;
    await submitScore(score, quizTime);
    displayScoreboard();
  }

  // Fetch and Display Top 5 Scores with formatted time
  async function displayScoreboard() {
    try {
      const scores = await fetchScores();
      scoreboardDisplay.innerHTML = "<h3>Top 5 Scores</h3>";
      scores.slice(0, 5).forEach((entry) => {
        const formattedTime = formatTime(entry.timeTaken); // Use raw milliseconds
        const scoreItem = document.createElement("p");
        scoreItem.style.display = "flex";
        scoreItem.style.justifyContent = "space-between";
        scoreItem.innerHTML = `<span>${entry.name}</span> <span>Score: ${entry.score}, Time: ${formattedTime}</span>`;
        scoreboardDisplay.appendChild(scoreItem);
      });
    } catch (error) {
      console.error("Error displaying scoreboard:", error);
    }
  }

  // Play Again Logic
  const restartQuizButton = document.getElementById("restart-quiz");
  restartQuizButton.addEventListener("click", () => {
    score = 0;
    currentQuestionIndex = 0;
    resultsSection.style.display = "none";
    document.getElementById("body").style.display = "block";
  });
});
