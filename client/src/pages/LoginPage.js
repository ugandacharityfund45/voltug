// client/src/pages/LoginPage.js
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';
import logo from '../assets/logo.png'; 


const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrPhone: '',
    password: '',
  });
  const [showPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await login(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/platform');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
            <div className="header-left">
              <div className="logo-section">
              <img src={logo} alt="Volt Investment Logo" className="platform-logo" />
              <h2 className="auth-title">Welcome To Volt </h2>     
             </div>
           </div>
        
        <p className="auth-subtitle">Login to your investment account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="usernameOrPhone"
            placeholder="Username or Phone"
            value={formData.usernameOrPhone}
            onChange={handleChange}
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p className="auth-message error">{message}</p>}

        {/* Forgot password link */}
        <p className="auth-footer">
          <span className="auth-link" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </span>
        </p>

        <p className="auth-footer">
          Don’t have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/register')}>
            create new account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
