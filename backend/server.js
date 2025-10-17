import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import commentRoutes from "./routes/comments.js";

import { protect } from "./middleware/authMiddleware.js"; // import protect middleware

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => res.send("Running!"));

// Auth routes: register & login
app.use("/api/auth", authRoutes);

// User routes (list users, get by id, delete user)
app.use("/api/users", userRoutes);

// Post routes
// GET routes are public
app.use("/api/posts", postRoutes);

app.use("/api/posts", commentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


import path from "path";
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const frontendPath = path.join(__dirname, "../frontend/dist"); // CRA: replace 'dist' with 'build'
  
  app.use(express.static(frontendPath));

  // Use a function for catch-all route
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(cors({
  origin: "https://grocerystore-tau.vercel.app",
  credentials: true
}));
