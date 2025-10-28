// investment-platform/client/src/services/adminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// ✅ Get all users (admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ Reset daily tasks (admin only)
export const resetDailyTasks = async (secret) => {
  const token = localStorage.getItem('token');
  return axios.post(
    `${API_URL}/reset-daily-tasks`,
    { secret },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// ✅ Admin user controll (admin only)

// ✅ Block a user (admin only)
export const blockUser = async (userId) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `${API_URL}/block-user/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// ✅ Unblock a user (admin only)
export const unblockUser = async (userId) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `${API_URL}/unblock-user/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// ✅ Delete a user (admin only)
export const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/delete-user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Send message to user (admin only)
export const sendMessageToUser = async (userId, message) => {
  const token = localStorage.getItem('token');
  return axios.post(
    `${API_URL}/message/${userId}`,
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};