// investment-platform/client/src/pages/Commissions.js

import React, { useEffect, useState } from 'react';
import { getUserEarnings } from '../services/earningsService';
import '../styles/Commissions.css';

const MyEarningsPage = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchEarnings = async () => {
    try {
      const data = await getUserEarnings();
      setEarnings(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
    const interval = setInterval(fetchEarnings, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="loading-message">Loading earnings...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!earnings) return null;

  return (
    <div className="earnings-container">
      <h2>💰 My Earnings</h2>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        Last updated: {lastUpdated}
      </p>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>From Daily Tasks:</strong> UGX {earnings.totalFromTasks.toLocaleString()}</p>
        <p><strong>From Referrals:</strong> UGX {earnings.totalFromReferrals.toLocaleString()}</p>
        <h3>
          Total Earnings: <span>UGX {earnings.totalEarnings.toLocaleString()}</span>
        </h3>
      </div>

      <h4>Earning History</h4>
      {earnings.history.length === 0 ? (
        <p>No earning history found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (UGX)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {earnings.history.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.taskName}</td>
                  <td>{entry.reward.toLocaleString()}</td>
                  <td>{new Date(entry.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEarningsPage;
