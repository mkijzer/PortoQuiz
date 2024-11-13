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

  // Reset time and display initial values
  timeLeft = 10;
  timeDisplay.textContent = timeLeft;

  // Reset the timer bar to full width and set transition
  timerBar.style.transition = "none"; // Disable transition for immediate reset
  timerBar.style.width = "100%"; // Reset to full width instantly

  // Add a tiny delay before starting the width transition for the timer bar
  setTimeout(() => {
    timerBar.style.transition = `width ${timeLeft}s linear`;
    timerBar.style.width = "0%"; // Start shrinking immediately
  }, 50); // A slight delay allows CSS to recognize the width change

  // Start the countdown timer for time display
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestionCallback();
    }
  }, 1000);
}

// Reset Timer
export function resetTimer() {
  clearInterval(timer);
  const timerBar = document.querySelector(".timer-bar");
  if (timerBar) {
    timerBar.style.transition = "none"; // Instantly reset without transition
    timerBar.style.width = "100%"; // Reset the timer bar width
  }
}

// Start the total quiz time tracking
export function startQuizTimer() {
  quizStartTime = new Date().getTime();
}

// Stop total quiz timer and return the calculated time in milliseconds
export function stopQuizTimer() {
  const quizEndTime = new Date().getTime();
  const totalTime = quizEndTime - quizStartTime;
  console.log("Total quiz time in milliseconds:", totalTime); // Debugging line
  return totalTime; // Returns time in milliseconds
}

// Format time to display as MM:SS:HH where HH is hundredths of a second
export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const hundredths = String(Math.floor((milliseconds % 1000) / 10)).padStart(
    2,
    "0"
  );

  console.log(`Formatted time: ${minutes}:${seconds}:${hundredths}`); // Debugging line
  return `${minutes}:${seconds}:${hundredths}`;
}
