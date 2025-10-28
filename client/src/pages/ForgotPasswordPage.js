// ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';

const API_URL = 'http://localhost:5000/api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = send token, 2 = enter token & new password
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send reset token
  const handleSendToken = async () => {
    setError('');
    setMessage('');
    if (!phone) return setError('Please enter your phone number');

    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { phone });
      setMessage(`Reset token sent, Please contact CustomerService to get your token`);
      setStep(2);
      setTimer(900); // 15 minutes
      console.log('Token (dev only):', res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset token');
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async () => {
    if (timer <= 0) return setError('Token has expired. Please request a new one.');
    setError('');
    setMessage('');
    if (!token || !newPassword) return setError('Fill all fields');

    try {
      const res = await axios.post(`${API_URL}/reset-password`, { phone, token, newPassword });
      setMessage(res.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  // Format timer mm:ss
  const formatTimer = (t) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;

  return (
    <div className="forgot-password-container">
      <h2>Password Reset</h2>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {step === 1 && (
        <div className="form-step">
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSendToken}>Send Reset Token</button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <input
            type="text"
            placeholder="Enter the token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            disabled={timer <= 0}
            className={timer <= 0 ? 'disabled-btn' : ''}
          >
            Reset Password
          </button>
          <div className="timer">
            {timer > 0 ? `Token expires in: ${formatTimer(timer)}` : 'Token expired'}
          </div>
        </div>
      )}

        {/* Forgot password link */}
        <p className="auth-footer">
          <span className="auth-link" onClick={() => navigate('/login')}>
            Go back to login
          </span>
        </p>
    </div>
  );
};

export default ForgotPassword;
