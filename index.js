import express from "express";
import path from "path";
import quizRoutes from "./routes/quizRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS globally for all origins
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(process.cwd(), "public")));

// API routes
app.use("/api", quizRoutes);

// Default route for the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
