import Post from "../models/Posts.js";

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // latest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    const authorName = req.user?.name;

    if (!authorId || !authorName) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      authorId,
      name: authorName,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) return res.status(401).json({ message: "Unauthorized" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId !== authorId)
      return res.status(403).json({ message: "Forbidden" });

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) return res.status(401).json({ message: "Unauthorized" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId !== authorId)
      return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(userId)) post.likes.push(userId);
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter((id) => id !== userId);
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};