import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, fetchPost, updatePost } from '../store/postsSlice';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector(s => s.auth);
  const localUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      dispatch(fetchPost(id)).unwrap()
        .then(p => {
          setTitle(p.title);
          setContent(p.content);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return setError('All fields are required');

    setLoading(true);
    setError('');
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        author: user?.name || localUser?.name || 'Unknown',
        authorId: user?.id || localUser?.id
      };

      if (isEdit) await dispatch(updatePost({ id, ...payload })).unwrap();
      else await dispatch(createPost(payload)).unwrap();

      navigate('/');
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isEdit ? 'Edit Post' : 'New Post'}</h2>

      {error && <p className="error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: '#fff' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Title</label>
          <input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1em',
              outline: 'none',
              transition: '0.2s'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Content</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder="Write your post here..."
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1em',
              resize: 'vertical',
              outline: 'none',
              transition: '0.2s'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!token || loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: loading ? '#999' : '#007bff',
            color: '#fff',
            fontSize: '1em',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: '0.3s'
          }}
        >
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );
}
