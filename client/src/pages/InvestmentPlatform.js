import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import DailyTasks from './DailyTasksPage';
import MyEarningsPage from './Commissions';
import MyTeam from './MyTeam';
import WalletPage from './WalletPage';
import CustomerServicePage from './CustomerServicePage';
import AboutPage from './AboutPage';
import DepositPage from './DepositPage';
import RequestWithdrawal from './WithdrawalRequest';
import axios from 'axios';
import '../styles/InvestmentPlatform.css';
import "../styles/AboutPage.css";
import logo from '../assets/logo.png'; // ✅ import your logo

const API_URL = 'http://localhost:5000/api';

const InvestmentPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [earningsRefreshTrigger, setEarningsRefreshTrigger] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      fetchUserBalance(parsed.id);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        fetchUserBalance(user.id);
        setEarningsRefreshTrigger((prev) => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const fetchUserBalance = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/${id}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
      setLoading(false);
    } catch (err) {
      console.error('Balance fetch failed:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
    setUser((prev) => ({ ...prev, walletBalance: newBalance }));
  };

  const refreshEarnings = () => {
    setEarningsRefreshTrigger((prev) => prev + 1);
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      alert('User ID copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Investment Platform...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="session-expired">
        <h2>Session expired</h2>
        <button onClick={() => (window.location.href = '/login')}>Go to Login</button>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard' },
    { id: 'deposit', label: '💸 Deposit' },
    { id: 'tasks', label: '🧩 Daily Tasks' },
    { id: 'commissions', label: '💰 My Earnings' },
    { id: 'wallet', label: '👛 Wallet' },
    { id: 'withdraw', label: '🏦 Withdraw' },
    { id: 'transactions', label: '💳 Transactions' },
    { id: 'team', label: '👥 My Team' },
    { id: 'customerservice', label: '🛠️ Support' },
    { id: 'about', label: 'ℹ️ About' },
  ];

  return (
    <div className="investment-platform-container">
      {/* Header */}
      <header className="investment-header">
        <div className="header-left">
          <div className="logo-section">
            <img src={logo} alt="Volt Investment Logo" className="platform-logo" />
            <h1 className="platform-name">Volt Investment Uganda</h1>
          </div>

          <div className="user-id-box">
            <p>
              <strong>ID:</strong> {user.id}{' '}
              <button className="copy-id-btn" onClick={handleCopyId}>Copy</button>
            </p>
          </div>
        </div>

        <div className="user-info">
          <p>Welcome, <strong>{user.username}</strong></p>
          <p className="balance-text">Balance: UGX {balance.toLocaleString()}</p>
        </div>

        {/* 🔒 Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Grid Card Links */}
      <div className="grid-links">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`grid-card ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="grid-icon">{tab.label.split(' ')[0]}</div>
            <div className="grid-label">{tab.label.replace(/^[^\s]+\s/, '')}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="investment-main">
        {activeTab === 'dashboard' && (
          <Dashboard user={user} balance={balance} onNavigate={(tabId) => setActiveTab(tabId)} />
        )}

        {activeTab === 'deposit' && <DepositPage user={user} onBalanceUpdate={handleBalanceUpdate} />}
        {activeTab === 'tasks' && (
          <DailyTasks
            user={user}
            onBalanceUpdate={handleBalanceUpdate}
            onEarningsUpdate={refreshEarnings}
            onNavigate={(tabId) => setActiveTab(tabId)}
          />
        )}
        {activeTab === 'commissions' && <MyEarningsPage refreshTrigger={earningsRefreshTrigger} />}
        {activeTab === 'wallet' && <WalletPage onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'withdraw' && <RequestWithdrawal user={user} onBalanceUpdate={handleBalanceUpdate} />}
        {activeTab === 'transactions' && (
          <Transactions user={user} onBalanceUpdate={handleBalanceUpdate} onEarningsUpdate={refreshEarnings} />
        )}
        {activeTab === 'team' && <MyTeam />}
        {activeTab === 'customerservice' && <CustomerServicePage onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'about' && <AboutPage />}
      </main>
      
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

export default InvestmentPlatform;
