import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestWithdrawal, getTransactions } from '../services/transactionService';
import '../styles/WithdrawalPage.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const WithdrawalPage = () => {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const navigate = useNavigate();

  // Fetch wallet balance
  const fetchBalance = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/${userId}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Fetch transactions
  const fetchTransactionsData = async (userId) => {
    try {
      const res = await getTransactions();
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sorted);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load user and wallet data
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    fetchBalance(parsed.id);
    fetchTransactionsData(parsed.id);

    // Page auto-refresh every second
    const interval = setInterval(() => {
      fetchBalance(parsed.id);
      fetchTransactionsData(parsed.id);
    }, 1000); // refresh every 1s

    return () => clearInterval(interval);
  }, []);

  // Handle withdrawal confirmation
  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount!');
      return;
    }

    const hasDeposit = transactions.some(
      (tx) => tx.type === 'deposit' && tx.status === 'approved'
    );
    if (!hasDeposit) {
      toast.warning('Make a successful deposit first.');
      return;
    }

    if (Number(amount) > balance) {
      toast.error('Cannot withdraw more than balance!');
      return;
    }

    try {
      const res = await requestWithdrawal(Number(amount));
      toast.success(res.data.message || 'Withdrawal requested successfully!');
      setAmount('');
      fetchBalance(user.id);
      fetchTransactionsData(user.id);

      // Redirect after success
      setTimeout(() => {
        navigate('/platform'); // change path if your platform home differs
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  if (loading) return <p>Loading wallet...</p>;
  if (!user) return <p>Please log in to withdraw funds.</p>;

  return (
    <div className="transactions-container">
      <h2>💸 Request Withdrawal</h2>

      <p>
        <strong>Available Balance:</strong>{' '}
        {loadingBalance ? (
          <span>Fetching...</span>
        ) : (
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            UGX {balance.toLocaleString()}
          </span>
        )}
      </p>

      <div className="transaction-form">
        <input
          type="number"
          placeholder="Enter requested withdrawal amount (UGX)......."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="transaction-input"
        />
        <button className="btn btn-withdraw" onClick={handleWithdraw}>
          Confirm Withdrawal
        </button>
      </div>

      <h3>Recent Transactions</h3>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className={tx.status.toLowerCase()}>
                    <td>{tx.type}</td>
                    <td>{tx.amount.toLocaleString()}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Navigation button to go back to dashboard */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/platform')}
          className="btn btn-back"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <footer className="about-footer">
        <p>
          📍 <b>Head Office:</b> Kampala, Uganda
        </p>
        <p>
          📧 Email: <a href="mailto:support@voltuganda.com">support@voltuganda.com</a>
        </p>
        <p>🌐 Website: <a href="https://www.voltuganda.com" target="_blank" rel="noopener noreferrer">
        www.voltuganda.com</a></p>
        <p className="copyright">
          © {new Date().getFullYear()} Volt Investment Uganda. All rights reserved.
        </p>
      </footer>
      
    </div>
  );
};

export default WithdrawalPage;
