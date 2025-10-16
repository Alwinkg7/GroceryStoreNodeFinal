import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar.jsx'
import PostsList from './pages/PostsList.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { useSelector } from 'react-redux'

function RequireAuth({ children }) {
  const token = useSelector(s => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/new" element={<RequireAuth><PostForm /></RequireAuth>} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<RequireAuth><PostForm /></RequireAuth>} />
      </Routes>
    </div>
  )
}

