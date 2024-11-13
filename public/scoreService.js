export async function submitScore(score, timeTaken) {
  console.log("Submitting score:", { score, timeTaken });
  const nameModal = document.getElementById("nameModal");
  const nameInput = document.getElementById("nameInput");
  const submitButton = document.getElementById("submitName");

  nameModal.style.display = "flex";

  return new Promise((resolve) => {
    submitButton.onclick = async () => {
      const name = nameInput.value.trim();
      console.log("Name entered:", name);

      if (name) {
        nameModal.style.display = "none";

        // Dynamic baseUrl for local and Render environments
        const baseUrl = window.location.origin.includes("localhost")
          ? "http://localhost:3000" // Local testing
          : "https://your-app.onrender.com"; // Render production

        const response = await fetch(`${baseUrl}/api/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, score, timeTaken }),
        });

        if (response.ok) {
          console.log("Score submitted successfully");
        } else {
          console.error("Failed to submit score:", response.statusText);
        }

        nameInput.value = "";
        resolve();
      } else {
        alert("Please enter a valid name.");
      }
    };
  });
}

export async function fetchScores() {
  try {
    // Dynamic baseUrl for local and Render environments
    const baseUrl = window.location.origin.includes("localhost")
      ? "http://localhost:3000" // Local testing
      : "https://your-app.onrender.com"; // Render production

    const response = await fetch(`${baseUrl}/api/scores`);

    if (!response.ok) {
      throw new Error(`Error fetching scores: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched scores:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch scores:", error.message);
    return [];
  }
}
