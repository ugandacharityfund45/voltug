import axios from "axios";

const API_URL = "http://localhost:5000/api/mobilemoney";

export const depositFunds = (data) => axios.post(`${API_URL}/deposit`, data);
export const withdrawFunds = (data) => axios.post(`${API_URL}/withdraw`, data);
export const checkStatus = (reference) => axios.get(`${API_URL}/status/${reference}`);
export const getWallet = (phone) => axios.get(`${API_URL}/wallet/${phone}`);
export const getTransactions = (phone) => axios.get(`${API_URL}/transactions/${phone}`);
