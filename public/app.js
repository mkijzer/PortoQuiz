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
  let questionCount = 10;

  async function fetchQuestions() {
    try {
      // Use dynamic baseUrl for both local and Render environments
      const baseUrl = window.location.origin.includes("localhost")
        ? "http://localhost:3000" // Local testing
        : "https://your-app.onrender.com"; // Render production

      const response = await fetch(
        `${baseUrl}/api/questions?count=${questionCount}`
      );
      if (!response.ok) {
        console.error(
          "Failed to fetch questions:",
          response.status,
          response.statusText
        );
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      questions = data.questions;
      console.log("Fetched questions:", questions);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    }
  }

  startQuizButton.addEventListener("click", () => {
    questionCountModal.style.display = "flex";
  });

  questionCountButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      questionCount = e.target.getAttribute("data-count");
      questionCountModal.style.display = "none";
      await startQuiz();
    });
  });

  async function startQuiz() {
    startQuizTimer();
    await fetchQuestions();
    document.getElementById("body").style.display = "none";
    quizSection.style.display = "block";
    startQuestion();
  }

  function startQuestion() {
    if (currentQuestionIndex < questions.length) {
      showQuestion();
      startTimer(handleTimeOut);
    } else {
      endQuiz();
    }
  }

  function showQuestion() {
    resetTimer();
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectAnswer(option));
      optionsContainer.appendChild(button);
    });
  }

  function selectAnswer(selectedOption) {
    resetTimer();
    const question = questions[currentQuestionIndex];
    if (selectedOption === question.answer) {
      score++;
    }
    currentQuestionIndex++;
    startQuestion();
  }

  function handleTimeOut() {
    currentQuestionIndex++;
    startQuestion();
  }

  async function endQuiz() {
    resetTimer();
    const quizTime = stopQuizTimer();
    quizSection.style.display = "none";
    resultsSection.style.display = "block";
    scoreDisplay.textContent = `Score: ${score}`;
    await submitScore(score, quizTime);
    displayScoreboard();
  }

  async function displayScoreboard() {
    try {
      const scores = await fetchScores();
      scoreboardDisplay.innerHTML = "<h3>Top 5 Scores</h3>";
      scores.slice(0, 5).forEach((entry) => {
        const formattedTime = formatTime(entry.timeTaken);
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

  const restartQuizButton = document.getElementById("restart-quiz");
  restartQuizButton.addEventListener("click", () => {
    score = 0;
    currentQuestionIndex = 0;
    resultsSection.style.display = "none";
    document.getElementById("body").style.display = "block";
  });
});