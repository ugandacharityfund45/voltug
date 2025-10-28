import React, { useState, useEffect } from 'react';
import { deposit, getTransactions } from '../services/transactionService';
import '../styles/WithdrawalPage.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Add navigation import

const API_URL = 'http://localhost:5000/api';

const DepositPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // ✅ Deposit Numbers
  const DEPOSIT_NUMBERS = {
    MTN: '0774527378',
    Airtel: '0709486401',
  };

    const handleCopyNumber = () => {
    const numberToCopy = DEPOSIT_NUMBERS[network];
    navigator.clipboard.writeText(numberToCopy);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

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

    const interval = setInterval(() => {
      fetchBalance(parsed.id);
      fetchTransactionsData(parsed.id);
    }, 2000); // refresh every 2s

    return () => clearInterval(interval);
  }, []);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount!');
      return;
    }

    try {
      const res = await deposit(Number(amount));
      toast.success(res.data.message || 'Deposit successful!');
      setAmount('');

      if (res.data.balance != null) setBalance(res.data.balance);
      fetchTransactionsData(user.id);

      // ✅ Redirect to DailyTaskPage after a short delay
      setTimeout(() => {
        navigate('/platform');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed');
    }
  };

  if (loading) return <p>Loading wallet...</p>;
  if (!user) return <p>Please log in to deposit funds.</p>;

  return (
    <div className="transactions-container">
      <h2>Mobile Money Deposit</h2>

        {/* Deposit Number Info */}
        <div className="deposit-info-box">
          <p>
          <strong> 🚫 Failed to send a confirmation message.  Please copy 
            the Number below and transfer the amount manually via mobile money. Besure to confirm the right Number and Names before transaction.  </strong>
          </p>
        </div>


        {/* Network Selection */}
        <div className="network-select">
      <p className="deposit-subtitle">
        Choose your network and transfer deposit amount to the number shown below.
      </p>
          <label>
            <input
              type="radio"
              name="network"
              value="MTN"
              checked={network === 'MTN'}
              onChange={(e) => setNetwork(e.target.value)}
            />
            <img src="/mtn-logo.png" alt="MTN" className="network-logo" /> MTN
          </label>

          <label>
            <input
              type="radio"
              name="network"
              value="Airtel"
              checked={network === 'Airtel'}
              onChange={(e) => setNetwork(e.target.value)}
            />
            <img src="/airtel-logo.svg" alt="Airtel" className="network-logo" /> Airtel
          </label>
        </div>

        <div className="form-group">
          <label>Amount (UGX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {/* Deposit Copy Section */}
        <div className="deposit-info-box">
          <p>
           If you don't receive a confirmation message please copy the{' '}
            <strong>{network}</strong> number below and transfer <strong>UGX {amount || 0}</strong> manualiy via mobile money:
          </p>
          <p><strong>Name :</strong> Bashir Kisitu </p>


          <div className="deposit-number-box">
            <h3 className="deposit-number">{DEPOSIT_NUMBERS[network]}</h3>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopyNumber}
            >
              Copy Number
            </button>
          </div>

          {copyStatus && <p className="copy-status">{copyStatus}</p>}
        </div>

      <div className="transaction-form">
        <input
          type="number"
          placeholder="Enter again deposit amount and confirm..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="transaction-input"
        />
        <button className="btn btn-deposit" onClick={handleDeposit}>
          Confirm Deposit
        </button>
      </div>

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

export default DepositPage;
