import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPasswordPage.css';

const API_URL = 'http://localhost:5000/api/auth';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [email, setEmail] = useState(''); // used for resend

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message || 'Password reset successful! Redirecting...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password.';
      setMessage(errorMsg);

      // Detect expired token from backend message
      if (errorMsg.toLowerCase().includes('expired')) {
        setTokenExpired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (!email) {
      setMessage('Please enter your email to resend the reset token.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/resend-reset-token`, { email });
      setMessage(res.data.message || 'New reset link sent to your email!');
      setTokenExpired(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>

      {!tokenExpired ? (
        <form onSubmit={handleResetPassword} className="reset-password-form">
          <label htmlFor="password" className="reset-password-label">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="reset-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />

          <label htmlFor="confirmPassword" className="reset-password-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="reset-password-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />

          <button
            type="submit"
            className="reset-password-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="resend-token-section">
          <p className="reset-password-message">
            Your reset token has expired. Please request a new one below.
          </p>

          <input
            type="email"
            className="reset-password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />

          <button
            onClick={handleResendToken}
            className="reset-password-button resend-btn"
            disabled={loading}
          >
            {loading ? 'Resending...' : 'Resend Reset Token'}
          </button>
        </div>
      )}

      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
