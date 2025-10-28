import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminregister } from '../services/authService';
import '../styles/AdminRegisterPage.css';
import logo from '../assets/logo.png';

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await adminregister(formData);
      setMessage(res.data.message || '✅ Admin registered successfully!');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-wrapper">
      <div className="admin-register-card">
            <div className="header-left">
              <div className="logo-section">
              <img src={logo} alt="Volt Investment Logo" className="platform-logo" />
        <h2 className="admin-register-title">Volt Admin Registration</h2>      
             </div>
           </div>
        <p className="admin-register-subtitle">Create your administrator account</p>

        <form onSubmit={handleSubmit} className="admin-register-form">

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div className="form-group password-group">
            <label>Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register Admin'}
          </button>
        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <p className="auth-footer">
          Already registered?{' '}
          <span className="auth-link" onClick={() => navigate('/admin/login')}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
