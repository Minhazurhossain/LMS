import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lmsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBook, FaClock, FaUser } from 'react-icons/fa';
import '../styles/Courses.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;
      
      const response = await lmsAPI.getCourses(params);
      setCourses(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await lmsAPI.getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleEnroll = async (courseId) => {
    if (user.role !== 'student') {
      toast.warning('Only students can enroll in courses');
      return;
    }
    
    try {
      await lmsAPI.enrollCourse(courseId);
      toast.success('Successfully enrolled!');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Enrollment failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Available Courses</h1>
        {(user.role === 'admin' || user.role === 'instructor') && (
          <Link to="/courses/create" className="btn-primary">
            Create Course
          </Link>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search courses..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="course-image" />
            )}
            
            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <span className="badge">{course.difficulty}</span>
                <span className="meta-item">
                  <FaUser /> {course.instructor_name}
                </span>
                <span className="meta-item">
                  <FaClock /> {course.duration_weeks} weeks
                </span>
                <span className="meta-item">
                  <FaBook /> {course.enrolled_count} enrolled
                </span>
              </div>
              
              <div className="course-actions">
                <Link to={`/courses/${course.id}`} className="btn-secondary">
                  View Details
                </Link>
                
                {user.role === 'student' && (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="btn-primary"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="no-results">
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;