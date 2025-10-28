import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLoginPage.css';

const AdminLoginPage = () => {
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', { usernameOrPhone, password });
      const { user, token } = res.data;

      if (!user?.isAdmin) {
        setError('Access denied. Admins only.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">👑 Admin Portal</h2>
        <p className="admin-login-subtitle">Authorized access only</p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="text"
            placeholder="Username or Phone"
            value={usernameOrPhone}
            onChange={(e) => setUsernameOrPhone(e.target.value)}
            required
            className="admin-input"
          />

          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input"
            />
          </div>
          <div className="view-password-toggle">
                        <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="admin-error">{error}</p>}

        {/* Forgot password link */}
        <p className="auth-footer">
          <span className="auth-link" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </span>
        </p>
        </form>

        <p className="admin-login-footer">© {new Date().getFullYear()} Investment Platform Admin</p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
