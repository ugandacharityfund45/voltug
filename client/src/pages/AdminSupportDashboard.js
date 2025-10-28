import React, { useEffect, useState } from 'react';
import {
  getAllSupportMessages,
  replyToMessage
} from '../services/supportService';
import '../styles/AdminSupportDashboard.css';

const AdminSupportDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all support messages
  const fetchMessages = async () => {
    try {
      const res = await getAllSupportMessages();
      setMessages(res);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // 🔁 Auto refresh messages every second (1000ms)
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    // 🧹 Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle admin reply
  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert('Reply cannot be empty!');
      return;
    }

    try {
      await replyToMessage(id, replyText);
      alert('✅ Reply sent successfully!');
      setReplyText('');
      setSelectedMsg(null);
      fetchMessages(); // Refresh immediately after sending reply
    } catch (err) {
      console.error('❌ Failed to send reply:', err);
      alert(err.error || 'Failed to send reply.');
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(filter.toLowerCase()) ||
      msg.phone.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <h3 className="loading">Loading messages...</h3>;

  return (
    <div className="admin-support-container">
      <header>
        <h1>Customer Support Dashboard</h1>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </header>

      <table className="support-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Status</th>
            <th>Reply</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No messages found.
              </td>
            </tr>
          ) : (
            filteredMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{new Date(msg.date).toLocaleString()}</td>
                <td>{msg.name}</td>
                <td>{msg.phone}</td>
                <td>{msg.message}</td>
                <td>
                  <span
                    className={`status ${msg.status?.toLowerCase() || 'pending'}`}
                  >
                    {msg.status || 'Pending'}
                  </span>
                </td>
                <td>
                  {selectedMsg === msg._id ? (
                    <div className="reply-box">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply..."
                      />
                      <button
                        className="send-reply"
                        onClick={() => handleReply(msg._id)}
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
                      onClick={() => setSelectedMsg(msg._id)}
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSupportDashboard;
