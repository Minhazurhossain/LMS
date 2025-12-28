import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || '',
    bio: user.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      bio: user.bio || '',
    });
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h2>{user.first_name} {user.last_name}</h2>
            <p className="role-badge">{user.role.toUpperCase()}</p>
            <p className="email">{user.email}</p>
          </div>
        </div>

        <div className="profile-content">
          {!editing ? (
            <div className="profile-details">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user.first_name} {user.last_name}</p>
              </div>
              
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              
              <div className="detail-item">
                <label>Phone</label>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <label>Bio</label>
                <p>{user.bio || 'No bio added yet'}</p>
              </div>
              
              <div className="detail-item">
                <label>Member Since</label>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;