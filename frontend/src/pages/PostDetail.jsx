import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, fetchComments, addComment } from '../store/postsSlice';
import CommentForm from './CommentForm';

export default function PostDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: post, comments } = useSelector(s => s.posts);
  const { user } = useSelector(s => s.auth);

  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch post and comments
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([dispatch(fetchPost(id)), dispatch(fetchComments(id))]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, dispatch]);

  // Update comment list when Redux store changes
  useEffect(() => {
    if (comments[id]) setCommentList(comments[id]);
  }, [comments, id]);

  const handleCommentAdded = async (message) => {
    if (!user) return;
    try {
      await dispatch(addComment({ postId: id, message })).unwrap();
      dispatch(fetchComments(id)); // Refresh comments after adding
    } catch (e) {
      console.error('Failed to add comment', e);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (isLoading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading post...</p>;
  if (!post) return <p style={{ textAlign: 'center', padding: '50px' }}>Post not found</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <article style={{ background: '#807c7cff', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
        <header style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
          <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
          <p style={{ color: '#abaaaaff', fontSize: '0.9rem' }}>
            by {post.author || post.name || 'Unknown'} • {formatDate(post.createdAt)}
          </p>
          <p style={{ color: '#fcfcfcff', fontSize: '0.9rem' }}>
            {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
          </p>
        </header>

        <section style={{ padding: '30px' }}>
          <p style={{ lineHeight: 1.7, color: '#ffffffff' }}>{post.content}</p>
        </section>

        <section style={{ borderTop: '1px solid #eee' }}>
          <div style={{ padding: '20px 30px', background: '#5b5050ff' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Comments ({commentList.length})</h3>
          </div>

          {commentList.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {commentList.map((c) => (
                <li key={c._id} style={{ padding: '15px 30px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: 0 }}>{c.message}</p>
                  <small style={{ color: '#f1f1f1ff' }}>
                    {c.userName || c.userId || 'Anonymous'} • {c.createdAt ? formatDate(c.createdAt) : ''}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ padding: '20px 30px', color: '#c4c4c4ff', textAlign: 'center' }}>No comments yet. Be the first!</p>
          )}

          <div style={{ padding: '20px 30px' }}>
            {user ? (
              <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
            ) : (
              <p style={{ color: '#f9f9f9ff', textAlign: 'center' }}>Login to add a comment</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
