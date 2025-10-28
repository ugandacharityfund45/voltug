import React, { useEffect, useState } from 'react';
import {
  getPendingDeposits,
  approveDeposit,
  rejectDeposit,
} from '../services/transactionService';
import '../styles/AdminWithdrawalsApproval.css'; // reuse same styles

const AdminDepositsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchPending = async () => {
    try {
      const res = await getPendingDeposits();
      setRequests(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load pending deposits');
    }
  };

  useEffect(() => {
    fetchPending();

    // ✅ Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchPending();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveDeposit(id);
      setActionMsg('Deposit approved');
      fetchPending();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      await rejectDeposit(id, reason);
      setActionMsg('Deposit rejected');
      fetchPending();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="withdrawals-container">
      <h2>Admin: Deposit Approval</h2>

      {error && <p className="error-msg">{error}</p>}
      {actionMsg && <p className="success-msg">{actionMsg}</p>}

      <table className="withdrawals-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount (UGX)</th>
            <th>Requested At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userId.username || req.userId.phone}</td>
                <td>{req.amount.toLocaleString()}</td>
                <td>{new Date(req.createdAt).toLocaleString()}</td>
                <td>
                  <span className={`status ${req.status}`}>{req.status}</span>
                </td>
                <td className="action-buttons">
                  <button className="approve-btn" onClick={() => handleApprove(req._id)}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(req._id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                No pending deposits.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepositsApproval;
