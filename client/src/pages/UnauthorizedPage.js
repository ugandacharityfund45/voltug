import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UnauthorizedPage.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">🚫</div>
        <h2 className="unauthorized-title">Access Denied</h2>
        <p className="unauthorized-message">
          You are not authorized to view this page. Please check your account permissions or login with the correct credentials.
        </p>

        <div className="unauthorized-actions">
          <button onClick={() => navigate(-1)} className="unauthorized-btn secondary">
            ⬅ Go Back
          </button>
          <button onClick={() => navigate('/admin/login')} className="unauthorized-btn primary">
            🔑 Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
