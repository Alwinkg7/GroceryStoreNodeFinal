import Comment from "../models/Comment.js";

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a comment for a post
export const createComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const name = req.user?.name;
    if (!userId || !name) return res.status(401).json({ message: "Unauthorized" });

    const postId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = new Comment({ postId, userId, name, content });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
