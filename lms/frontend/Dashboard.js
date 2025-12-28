import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { lmsAPI } from '../services/api';
import { FaUsers, FaBook, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await lmsAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const renderAdminDashboard = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-content">
          <h3>{stats.total_users}</h3>
          <p>Total Users</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaBook />
        </div>
        <div className="stat-content">
          <h3>{stats.total_courses}</h3>
          <p>Total Courses</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaGraduationCap />
        </div>
        <div className="stat-content">
          <h3>{stats.total_students}</h3>
          <p>Students</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>{stats.total_enrollments}</h3>
          <p>Total Enrollments</p>
        </div>
      </div>
    </div>
  );

  const renderInstructorDashboard = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaBook />
        </div>
        <div className="stat-content">
          <h3>{stats.total_courses}</h3>
          <p>My Courses</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-content">
          <h3>{stats.total_students}</h3>
          <p>Total Students</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaGraduationCap />
        </div>
        <div className="stat-content">
          <h3>{stats.total_enrollments}</h3>
          <p>Total Enrollments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>{stats.active_enrollments}</h3>
          <p>Active Students</p>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FaBook />
        </div>
        <div className="stat-content">
          <h3>{stats.enrolled_courses}</h3>
          <p>Enrolled Courses</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>{stats.in_progress}</h3>
          <p>In Progress</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaGraduationCap />
        </div>
        <div className="stat-content">
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-content">
          <h3>{stats.average_progress?.toFixed(1) || 0}%</h3>
          <p>Average Progress</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.first_name}!</h1>
        <p>Here's what's happening with your account today.</p>
      </div>
      
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'instructor' && renderInstructorDashboard()}
      {user.role === 'student' && renderStudentDashboard()}
    </div>
  );
};

export default Dashboard;