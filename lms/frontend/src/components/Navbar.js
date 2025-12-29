import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-icon"><FaGraduationCap /></div>
          <span className="logo-text">LMS Platform</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-menu ${open ? 'open' : ''}`}>
          <li>
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          </li>
          <li>
            <Link to="/courses" onClick={() => setOpen(false)}>Courses</Link>
          </li>
        </ul>

        <div className="navbar-user">
          <div className="avatar" title={`${user?.first_name || ''} ${user?.last_name || ''}`}>
            {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="user-info">
            <div className="user-name">{user?.first_name} {user?.last_name}</div>
            <div className="user-role">{user?.role}</div>
          </div>

          <div className="user-actions">
            <Link to="/profile" className="nav-icon" title="Profile" onClick={() => setOpen(false)}>
              <FaUser />
            </Link>
            <button onClick={handleLogout} className="nav-icon logout-btn" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
