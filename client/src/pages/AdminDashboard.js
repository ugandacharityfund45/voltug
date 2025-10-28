import React, { useEffect, useState } from 'react';
import { resetDailyTasks } from '../services/adminService';
import { toast } from 'react-toastify';
import { getAllUsers } from '../services/adminService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // ✅ Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Admin-only: Reset daily tasks
  const handleResetTasks = async () => {
  if (!window.confirm('⚠️ Are you sure you want to rest all users tasks?')) return;

  try {
    setResetting(true);
    const res = await resetDailyTasks('OLigbPoHOFWLL9fj540eMMw');
    toast.success(res.data.message || 'Daily tasks reset successfully!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error resetting tasks');
  } finally {
    setResetting(false);
  }
};

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1 className="admin-title">👑 Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage users, view referrals, and monitor system stats
          </p>
        </div>

        {/* ✅ Reset Tasks Button */}
        <div className="header-right">
          <button
            onClick={handleResetTasks}
            className={`btn btn-danger ${resetting ? 'btn-disabled' : ''}`}
            disabled={resetting}
          >
            {resetting ? 'Resetting...' : '🔄 Reset Daily Tasks'}
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : error ? (
        <p className="admin-error">{error}</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>Referral Code</th>
                <th>Referred By</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.phone}</td>
                    <td className="referral">{user.referralCode}</td>
                    <td>{user.referredBy || '-'}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isAdmin ? 'status-admin' : 'status-user'
                        }`}
                      >
                        {user.isAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
