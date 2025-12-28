import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <FaExclamationTriangle style={{ fontSize: '80px', color: '#f39c12', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '48px', color: '#333', marginBottom: '10px' }}>403</h1>
      <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '20px' }}>Unauthorized Access</h2>
      <p style={{ color: '#999', marginBottom: '30px', maxWidth: '500px' }}>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;