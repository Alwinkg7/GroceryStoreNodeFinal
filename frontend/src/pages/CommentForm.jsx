import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../store/postsSlice";

export default function CommentForm({ postId, onCommentAdded }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await dispatch(addComment({ postId, content: message }));
    setMessage("");
    onCommentAdded(message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Post</button>
    </form>
  );
}
