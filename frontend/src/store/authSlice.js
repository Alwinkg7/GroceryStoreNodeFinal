import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Register failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  }
);

// Initial state
const initialState = (() => {
  try {
    return {
      token: localStorage.getItem(TOKEN_KEY) || '',
      user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
      status: 'idle',
      error: ''
    };
  } catch {
    return { token: '', user: null, status: 'idle', error: '' };
  }
})();

// Slice
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = '';
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerUser.pending, (s) => { s.status = 'loading'; s.error = '' })
      .addCase(registerUser.fulfilled, (s) => { s.status = 'succeeded'; })
      .addCase(registerUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message || 'Register failed'; })

      // Login
      .addCase(loginUser.pending, (s) => { s.status = 'loading'; s.error = '' })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(TOKEN_KEY, s.token);
        localStorage.setItem(USER_KEY, JSON.stringify(s.user));
      })
      .addCase(loginUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message || 'Login failed'; });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
