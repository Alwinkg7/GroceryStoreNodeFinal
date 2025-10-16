import express from "express";
import { getCommentsByPost, createComment } from "../controllers/CommentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all comments for a post
router.get("/:id/comments", getCommentsByPost);

// Create a comment (authenticated)
router.post("/:id/comments", protect, createComment);

export default router;
