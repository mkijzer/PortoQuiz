// scoreService.js

// Function to submit score to the backend
export async function submitScore(score, timeTaken) {
  console.log("Submitting score:", score, "Time:", timeTaken); // Log submission details for debugging
  const nameModal = document.getElementById("nameModal");
  const nameInput = document.getElementById("nameInput");
  const submitButton = document.getElementById("submitName");

  nameModal.style.display = "flex";

  return new Promise((resolve) => {
    submitButton.onclick = async () => {
      const name = nameInput.value.trim();

      if (name) {
        nameModal.style.display = "none";

        // Send the score and time taken to the backend
        await fetch("http://localhost:3000/api/scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, score, timeTaken }),
        });

        nameInput.value = "";
        resolve();
      } else {
        alert("Please enter a valid name.");
      }
    };
  });
}

// Function to fetch scores from the backend
export async function fetchScores() {
  try {
    const response = await fetch("http://localhost:3000/api/scores");
    if (!response.ok) {
      throw new Error(`Error fetching scores: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched scores:", data); // Log fetched scores for debugging
    return data;
  } catch (error) {
    console.error("Failed to fetch scores:", error); // Log any errors encountered
  }
}
