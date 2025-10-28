// client/src/services/supportService.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/support';

// ------------------------
// USER: Send a support message
// ------------------------
export const sendSupportMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API_URL}/message`, messageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to send message' };
  }
};

// ------------------------
// USER: Get all messages for logged-in user
// ------------------------
export const getUserMessages = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch messages' };
  }
};

// ------------------------
// USER: Mark a reply as seen
// ------------------------
export const markReplySeen = async (messageId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.patch(`${API_URL}/mark-seen/${messageId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to mark reply as seen' };
  }
};

// ------------------------
// ADMIN: Get all messages (optional for admin page)
// ------------------------
export const getAllSupportMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch all messages' };
  }
};

// ------------------------
// ADMIN: Reply to a user (optional for admin page)
// ------------------------
export const replyToMessage = async (messageId, replyText) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API_URL}/reply/${messageId}`, { reply: replyText }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to send reply' };
  }
};
