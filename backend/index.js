import express from "express";
import path from "path";

import quizRoutes from "./routes/quizRoutes.js";
import corsMiddleware from "./middleware/corsMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for all origins
app.use(corsMiddleware);

// Serve frontend files
app.use(express.static(path.join(process.cwd(), "../frontend")));

// API routes
app.use("/api", quizRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
