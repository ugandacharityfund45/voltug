import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/WalletPage.css';
import { getTransactions } from '../services/transactionService';

const API_URL = 'http://localhost:5000/api';

const WalletPage = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);

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
      setLoadingBalance(false);
      return;
    }
    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    fetchBalance(parsed.id);
    fetchTransactionsData(parsed.id);

    // Auto-refresh every 2 seconds
    const interval = setInterval(() => {
      fetchBalance(parsed.id);
      fetchTransactionsData(parsed.id);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading wallet...</p>;
  if (!user) return <p>Please log in to view your wallet.</p>;

  return (
    <div className="transactions-container">
      <h2>💰 Volt Investment Wallet</h2>

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

      {/* Terms & Conditions */}
      <section className="wallet-terms">
        <h3>Withdrawal & Deposit Terms & Conditions</h3>
        <ul>
          <li>All deposits must be made through approved payment channels.</li>
          <li>Minimum deposit amount: UGX 10,000.</li>
          <li>Withdrawals can take up to 24 hours to be processed.</li>
          <li>Ensure your account details are correct before making a withdrawal.</li>
          <li>Minimum withdrawal amount: UGX 50,000.</li>
          <li>Users are requested to register with the mobile number at registration.</li>
          <li>All requested withdrawals shall be credited to the same number used during registration.</li>
          <li>For assistance, contact our support team from <strong>Your Dashboard</strong>.</li>
        </ul>
      </section>
    </div>
  );
};

export default WalletPage;
