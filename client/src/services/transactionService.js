// client/src/services/transactionService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';
const ADMIN_WITHDRAWALS_API_URL = 'http://localhost:5000/api/admin/withdrawals';
const ADMIN_DEPOSITS_API_URL = 'http://localhost:5000/api/admin/deposits';

const getToken = () => localStorage.getItem('token');

// -----------------------------
// User Services
// ----------------------------- 

// Deposit (creates pending transaction)
export const deposit = async (amount) => {
  return axios.post(`${API_URL}/deposit`, { amount }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Request Withdrawal (creates pending transaction)
export const requestWithdrawal = async (amount) => {
  return axios.post(`${API_URL}/withdraw-request`, { amount }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Get User Transactions
export const getTransactions = async () => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// -----------------------------
// Admin Withdrawal Services
// -----------------------------

// Get all pending withdrawals
export const getPendingWithdrawals = async () => {
  return axios.get(`${ADMIN_WITHDRAWALS_API_URL}/pending`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Approve a pending withdrawal
export const approveWithdrawal = async (id) => {
  return axios.post(`${ADMIN_WITHDRAWALS_API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Reject a pending withdrawal with reason
export const rejectWithdrawal = async (id, reason) => {
  return axios.post(`${ADMIN_WITHDRAWALS_API_URL}/${id}/reject`, { reason }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// -----------------------------
// Admin Deposit Services
// -----------------------------

// Get all pending deposits
export const getPendingDeposits = async () => {
  return axios.get(`${ADMIN_DEPOSITS_API_URL}/pending`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Approve a pending deposit
export const approveDeposit = async (id) => {
  return axios.put(`${ADMIN_DEPOSITS_API_URL}/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Reject a pending deposit with reason
export const rejectDeposit = async (id, reason) => {
  return axios.put(`${ADMIN_DEPOSITS_API_URL}/${id}/reject`, { reason }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
