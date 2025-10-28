import React, { useEffect, useState, useCallback } from 'react';
import {
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from '../services/transactionService';
import {
  getAllSupportMessages,
  replyToMessage,
} from '../services/supportService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminUserRequests.css';

const AdminUserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await getPendingWithdrawals();
      setRequests(res.data);
    } catch (err) {
      toast.error('⚠️ Failed to load withdrawals');
    }
  }, []);

  // Fetch support messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await getAllSupportMessages();
      setMessages(res);
    } catch (err) {
      toast.error('⚠️ Failed to load messages');
    }
  }, []);

  // Fetch both together
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchWithdrawals(), fetchMessages()]);
    setLoading(false);
  }, [fetchWithdrawals, fetchMessages]); // ✅ dependencies fixed

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchAll]); // ✅ no more missing dependency warning

  // Approve withdrawal
  const handleApprove = async (id) => {
    try {
      await approveWithdrawal(id);
      toast.success('✅ Withdrawal approved successfully!');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Approval failed');
    }
  };

  // Reject withdrawal
  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      await rejectWithdrawal(id, reason);
      toast.info('🚫 Withdrawal rejected');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Rejection failed');
    }
  };

  // Reply to message
// Reply to message
const handleReply = async (id) => {
  if (!replyText.trim()) {
    toast.warn('⚠️ Reply cannot be empty');
    return;
  }

  try {
    await replyToMessage(id, replyText);
    toast.success('📩 Reply sent successfully!');
    
    // ✅ Remove replied message instantly from state
    setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));

    setReplyText('');
    setSelectedMsg(null);
  } catch (err) {
    toast.error(err.error || '❌ Failed to send reply');
  }
};


  // Combine withdrawals and messages
  const combinedData = [
    ...requests.map((req) => ({
      id: req._id,
      username: req.userId?.username || 'N/A',
      phone: req.userId?.phone || 'N/A',
      userId: req.userId?._id || 'N/A',
      message: req.message || 'Withdrawal Request',
      amount: req.amount,
      date: req.createdAt,
      status: req.status,
      type: 'withdrawal',
    })),
    ...messages.map((msg) => ({
      id: msg._id,
      username: msg.name,
      phone: msg.phone,
      userId: msg.userId || 'N/A',
      message: msg.message,
      amount: '-',
      date: msg.date,
      status: msg.status || 'Pending',
      type: 'message',
    })),
  ].filter((item) =>
    [item.username, item.phone, item.userId]
      .join(' ')
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="admin-requests-container">
      <header>
        <h2>Admin Dashboard: User Withdrawals & Messages</h2>
        <input
          type="text"
          placeholder="Search by username, phone, or user ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </header>

      {loading ? (
        <p className="loading">⏳ Loading data...</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone</th>
              <th>User ID</th>
              <th>Message</th>
              <th>Amount (UGX)</th>
              <th>Requested At</th>
              <th>Status</th>
              <th>Reply / Actions</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.length > 0 ? (
              combinedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.username}</td>
                  <td>{item.phone}</td>
                  <td>{item.userId}</td>
                  <td>{item.message}</td>
                  <td>
                    {item.amount === '-'
                      ? '-'
                      : item.amount.toLocaleString()}
                  </td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>
                    <span className={`status ${item.status?.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.type === 'withdrawal' ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(item.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(item.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : selectedMsg === item.id ? (
                      <div className="reply-box">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                        />
                        <button
                          className="send-reply"
                          onClick={() => handleReply(item.id)}
                        >
                          Send
                        </button>
                        <button
                          className="cancel-reply"
                          onClick={() => setSelectedMsg(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="reply-btn"
                        onClick={() => setSelectedMsg(item.id)}
                      >
                        Reply
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  No requests or messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default AdminUserRequests;
