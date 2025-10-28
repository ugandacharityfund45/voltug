// investment-platform/client/src/pages/AdminUsersControl.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  sendMessageToUser,
} from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminUsersControl.css';

const AdminUsersControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ✅ Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Filter users by name or phone
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  });

  // ✅ Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ✅ Handle block/unblock
  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
        toast.success('User unblocked successfully');
      } else {
        await blockUser(userId);
        toast.warn('User blocked successfully');
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    }
  };

  // ✅ Handle delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  // ✅ Handle message send
  const handleMessageSend = async (userId) => {
    if (!messageText.trim()) return toast.warn('Enter a message first');
    try {
      await sendMessageToUser(userId, messageText);
      toast.success('Message sent successfully');
      setMessageText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-table-container">
      <ToastContainer />
      <h2>Admin - Users Control Panel</h2>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="8">No users found</td>
            </tr>
          ) : (
            currentUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`status-badge ${
                      user.isBlocked ? 'blocked' : 'active'
                    }`}
                  >
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    className="send-btn"
                    onClick={() => handleMessageSend(user._id)}
                  >
                    Send
                  </button>
                </td>
                <td>
                  <button
                    className={`action-btn ${
                      user.isBlocked ? 'unblock' : 'block'
                    }`}
                    onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🧭 Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${
                currentPage === i + 1 ? 'active-page' : ''
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersControl;
