import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/authSlice'
import postsReducer from './store/postsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  }
})


