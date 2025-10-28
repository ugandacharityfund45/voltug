// investment-platform/client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const signin = async (credentials) => {
  return axios.post(`${API_URL}/signin`, credentials);
};

export const adminregister = async (credentials) => {
  return axios.post(`${API_URL}/register-admin`, credentials);
};