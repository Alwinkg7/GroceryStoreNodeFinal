import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(s => s.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    try {
      // Register the user
      await dispatch(registerUser({ name, email, password })).unwrap();
      
      // Auto-login after registration
      const loginRes = await dispatch(loginUser({ email, password })).unwrap();
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Registration/Login failed:', err);
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Name</label>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Your Name"
          required 
        />

        <label>Email</label>
        <input 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com"
          required 
        />

        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Enter password"
          required 
        />

        <button className="btn" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Create Account'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
