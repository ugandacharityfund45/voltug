import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getTransactions } from '../services/transactionService';
import '../styles/Transactions.css';

const API_URL = 'http://localhost:5000/api';

const Transactions = ({ user, onBalanceUpdate }) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [success,] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // ✅ Memoized fetchBalance to prevent recreation on every render
  const fetchBalance = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/${user.id}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Balance fetch failed:', err);
    } finally {
      setLoadingBalance(false);
    }
  }, [user?.id]);

  // ✅ Memoized fetchTransactions
  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // ✅ UseEffect with stable dependencies
  useEffect(() => {
    if (!user?.id) return;

    fetchBalance();
    fetchTransactions();

    const interval = setInterval(() => {
      fetchBalance();
      fetchTransactions();
    }, 2000);

    return () => clearInterval(interval);
  }, [user?.id, fetchBalance, fetchTransactions]);



  if (!user) return <p>Please log in to see transactions.</p>;

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">💰 Volt Wallet & Transactions</h2>

      <p className="transactions-balance">
        <strong>Current Balance:</strong>{' '}
        {loadingBalance ? (
          <span className="loading-balance">Fetching...</span>
        ) : (
          <span className="balance-amount">UGX {balance.toLocaleString()}</span>
        )}
      </p>

      <div className="transaction-form">


        {error && <p className="alert error">{error}</p>}
        {success && <p className="alert success">{success}</p>}
      </div>

      <h3 className="transactions-subtitle">Recent Transactions</h3>

      {loading ? (
        <p className="loading-text">Loading transactions...</p>
      ) : (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (UGX)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.type}</td>
                    <td>{tx.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status ${tx.status}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
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
    </div>
  );
};

export default Transactions;
