let timer;
let timeLeft = 10;
let quizStartTime;

// Start Timer for Each Question
export function startTimer(nextQuestionCallback) {
  const timeDisplay = document.getElementById("time-left");
  const timerBar = document.querySelector(".timer-bar");

  if (!timeDisplay || !timerBar) {
    console.error(
      "Error: 'time-left' or 'timer-bar' element not found in the DOM."
    );
    return;
  }

  timeLeft = 10;
  timeDisplay.textContent = timeLeft;

  timerBar.style.transition = "none";
  timerBar.style.width = "100%";

  setTimeout(() => {
    timerBar.style.transition = `width ${timeLeft}s linear`;
    timerBar.style.width = "0%";
  }, 50);

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestionCallback();
    }
  }, 1000);
}

export function resetTimer() {
  clearInterval(timer);
  const timerBar = document.querySelector(".timer-bar");
  if (timerBar) {
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
  }
}

export function startQuizTimer() {
  quizStartTime = new Date().getTime();
}

export function stopQuizTimer() {
  const quizEndTime = new Date().getTime();
  const totalTime = quizEndTime - quizStartTime;
  console.log("Total quiz time in milliseconds:", totalTime);
  return totalTime;
}

export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const hundredths = String(Math.floor((milliseconds % 1000) / 10)).padStart(
    2,
    "0"
  );

  console.log(`Formatted time: ${minutes}:${seconds}:${hundredths}`);
  return `${minutes}:${seconds}:${hundredths}`;
}
