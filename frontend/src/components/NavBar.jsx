import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../auth'
import './NavBar.css'

export default function NavBar() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Blog</Link>
        <Link to="/">Posts</Link>
        {user && <Link to="/posts/new">New</Link>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="user">{user.authorId}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}


