import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/postController.js";
import Post from "../models/Posts.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts); // GET /api/posts
router.get("/:id", getPostById); // GET /api/posts/:id

router.post("/", protect, createPost); // POST /api/posts
router.put("/:id", protect, updatePost); // PUT /api/posts/:id
router.delete("/:id", protect, deletePost); // DELETE /api/posts/:id

// Like a post
router.post("/:id/like", protect, likePost);
// Like/unlike
router.post("/:id/unlike", protect, unlikePost);


export default router;
