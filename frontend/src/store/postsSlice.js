import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "https://grocerystorenodefinal-5.onrender.com";

function authHeader() {
  const token = localStorage.getItem("authToken") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetch all posts
export const fetchPosts = createAsyncThunk("posts/list", async () => {
  const { data } = await axios.get(`${API}/posts`);
  return data;
});

// Fetch single post
export const fetchPost = createAsyncThunk("posts/get", async (id) => {
  const { data } = await axios.get(`${API}/posts/${id}`);
  return data;
});

// Create post
export const createPost = createAsyncThunk(
  "posts/create",
  async ({ title, content }) => {
    const { data } = await axios.post(
      `${API}/posts`,
      { title, content },
      { headers: authHeader() }
    );
    return data;
  }
);

// Update post
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, title, content }) => {
    const { data } = await axios.put(
      `${API}/posts/${id}`,
      { title, content },
      { headers: authHeader() }
    );
    return data;
  }
);

// Delete post
export const deletePost = createAsyncThunk("posts/delete", async (id) => {
  await axios.delete(`${API}/posts/${id}`, { headers: authHeader() });
  return id;
});

// Comments thunks
export const fetchComments = createAsyncThunk(
  "posts/comments/list",
  async (postId) => {
    const { data } = await axios.get(`${API}/posts/${postId}/comments`);
    return { postId, comments: data };
  }
);

export const addComment = createAsyncThunk(
  "posts/comments/add",
  async ({ postId, content }) => {
    try {
      // Send only { content } in POST body
      const res = await axios.post(
        `${API}/posts/${postId}/comments`,
        { content },
        { headers: { "Content-Type": "application/json", ...authHeader() } }
      );

      return { postId, comment: res.data };
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

// Likes
export const likePost = createAsyncThunk("posts/like", async (postId) => {
  const { data } = await axios.post(
    `${API}/posts/${postId}/like`,
    {},
    { headers: authHeader() }
  );
  return { postId, likes: data.likes };
});

export const unlikePost = createAsyncThunk("posts/unlike", async (postId) => {
  const { data } = await axios.post(
    `${API}/posts/${postId}/unlike`,
    {},
    { headers: authHeader() }
  );
  return { postId, likes: data.likes };
});

// Slice
const slice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    current: null,
    comments: {},
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.items = state.items.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.current && state.current._id === action.payload._id)
          state.current = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const arr = state.comments[action.payload.postId] || [];
        arr.push(action.payload.comment);
        state.comments[action.payload.postId] = arr;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
        if (state.current && state.current._id === action.payload.postId)
          state.current.likes = action.payload.likes;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.items.find((p) => p._id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
        if (state.current && state.current._id === action.payload.postId)
          state.current.likes = action.payload.likes;
      });
  },
});

export default slice.reducer;
