import axios from 'axios';

const API_URL = 'http://localhost:5000/api/daily-tasks';

export const getDailyTasks = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const completeTask = async (taskId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/${taskId}/complete`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
