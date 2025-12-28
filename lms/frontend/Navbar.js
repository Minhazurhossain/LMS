import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <FaGraduationCap />
          <span>LMS Platform</span>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin/reports">Reports</Link>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <span>{user?.first_name} {user?.last_name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          
          <div className="user-actions">
            <Link to="/profile" className="nav-icon">
              <FaUser />
            </Link>
            <button onClick={handleLogout} className="nav-icon logout-btn">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;