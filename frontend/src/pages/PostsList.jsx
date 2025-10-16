import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  deletePost,
  likePost,
  unlikePost,
  fetchComments,
  addComment,
} from "../store/postsSlice";
import CommentForm from "./CommentForm";

export default function PostsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts, comments } = useSelector((s) => s.posts);
  const { user, token } = useSelector((s) => s.auth);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingPosts(true);
        await dispatch(fetchPosts()).unwrap();
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, [dispatch]);

  // Fetch comments for each post
  useEffect(() => {
    posts.forEach((p) => {
      if (!comments[p._id]) dispatch(fetchComments(p._id));
    });
  }, [posts, comments, dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await dispatch(deletePost(id)).unwrap();
      alert("Post deleted successfully!");
    } catch (e) {
      alert("Failed to delete post");
    }
  };

  const handleLike = async (p) => {
    if (!user) return;
    try {
      if (p.likes.includes(user.id)) await dispatch(unlikePost(p._id)).unwrap();
      else await dispatch(likePost(p._id)).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentAdded = async (postId, message) => {
    try {
      await dispatch(addComment({ postId, content: message })).unwrap();
      dispatch(fetchComments(postId));
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  if (loadingPosts) return <p className="container">Loading posts...</p>;

  return (
    <div className="container">
      <div className="row between" style={{ marginBottom: "20px" }}>
        <h2>Posts</h2>
        {user && (
          <button
            className="btn primary"
            onClick={() => navigate("/posts/new")}
          >
            New Post
          </button>
        )}
      </div>

      {!posts.length ? (
        <p>No posts yet.</p>
      ) : (
        <div className="grid">
          {posts.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                <Link
                  to={`/posts/${p._id}`}
                  style={{ textDecoration: "none", color: "#333" }}
                >
                  {p.title}
                </Link>
              </h3>
              <p
                className="muted"
                style={{ fontSize: "0.85em", marginBottom: "10px" }}
              >
                by {p.name || "Unknown"} •{" "}
                {new Date(p.createdAt).toLocaleString()}
              </p>
              <p style={{ marginBottom: "15px" }}>
                {p.content.length > 150
                  ? p.content.slice(0, 150) + "…"
                  : p.content}
              </p>

              <div
                className="row gap"
                style={{ alignItems: "center", marginBottom: "10px" }}
              >
                <button
                  className="btn small"
                  onClick={() => handleLike(p)}
                  style={{
                    backgroundColor: p.likes.includes(user?.id)
                      ? "#ff4d6d"
                      : "#eee",
                    color: p.likes.includes(user?.id) ? "#fff" : "#333",
                  }}
                >
                  {p.likes.includes(user?.id) ? "❤️ Unlike" : "🤍 Like"} (
                  {p.likes.length})
                </button>
                <span>{comments[p._id]?.length || 0} Comments</span>
              </div>

              {/* Display Comments */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 15px",
                  background: "#f9f9f9",
                  borderRadius: "6px",
                }}
              >
                {comments[p._id] && comments[p._id].length > 0 ? (
                  comments[p._id].slice(-3).map((c) => (
                    <div
                      key={c._id}
                      style={{
                        marginBottom: "8px",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "5px",
                      }}
                    >
                      <strong style={{ color: "#2c5aa0" }}>
                        {c.name || "Anonymous"}
                      </strong>{" "}
                      •{" "}
                      <span style={{ fontSize: "0.8em", color: "#888" }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                      <p style={{ margin: "3px 0 0 0" }}>{c.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "0.85em", color: "#666" }}>
                    No comments yet.
                  </p>
                )}

                {/* Comment Form */}
                {user && (
                  <CommentForm
                    postId={p._id}
                    onCommentAdded={(msg) => handleCommentAdded(p._id, msg)}
                  />
                )}
              </div>

              {token && user && p.authorId === user.id && (
                <div className="row gap" style={{ marginTop: "10px" }}>
                  <button
                    className="btn secondary"
                    onClick={() => navigate(`/posts/${p._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
