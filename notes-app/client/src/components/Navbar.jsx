// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">NotesApp</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/notes">My Notes</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">👤 {user?.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
