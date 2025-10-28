import React, { useEffect, useState } from 'react';
import { getAllUsers, resetDailyTasks } from '../services/adminService';
import '../styles/AdminUsersPage.css';
import { toast } from 'react-toastify';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleResetTasks = async () => {
    if (!secret) {
      toast.warn('Please enter admin secret first');
      return;
    }

    try {
      await resetDailyTasks(secret);
      toast.success('Daily tasks reset successfully!');
    } catch (error) {
      console.error('Error resetting tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to reset daily tasks');
    }
  };

  return (
    <div className="admin-users-container">
      <h2>👑 Admin Dashboard - All Users</h2>

      <div className="reset-tasks-section">
        <input
          type="password"
          placeholder="Enter admin secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button onClick={handleResetTasks}>Reset Daily Tasks</button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>username</th>
              <th>Phone</th>
              <th>Wallet Balance (UGX)</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.walletBalance?.toLocaleString() || 0}</td>
                <td>{user.isAdmin ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
