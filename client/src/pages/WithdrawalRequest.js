import React, { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getUserMessages, sendSupportMessage, markReplySeen } from '../services/supportService';
import { useNavigate } from 'react-router-dom';  // ✅ Import navigation hook
import '../styles/CustomerServicePage.css';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // update for production

const WithdrawalRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', userId: '' });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Initialize user ID when logged in
  useEffect(() => {
    if (user?.uid) {
      setFormData((prev) => ({ ...prev, userId: user.uid }));
    }
  }, [user]);

  // Fetch messages from backend
  const fetchMessages = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const msgs = await getUserMessages(user.uid);
      setMessages(msgs);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize socket connection for this user
  useEffect(() => {
    if (!user?.uid) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: { userId: user.uid },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('joinUserRoom', { userId: user.uid });
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnecting... (attempt ${attempt})`);
    });

    // Listen for admin replies in real-time
    socket.on('adminReply', (data) => {
      console.log('📨 New admin reply:', data);
      setMessages((prev) => [...prev, { ...data, replySeen: false }]);
    });

    return () => {
      console.log('🧹 Cleaning up socket...');
      socket.disconnect();
    };
  }, [user]);

  // Fetch existing messages initially
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please fill out all fields');
      return;
    }

    const payload = {
      userId: formData.userId,
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
    };

    try {
      console.log('📤 Sending message:', payload);

      // Optimistically update UI before server confirms
      const tempMsg = {
        _id: `temp-${Date.now()}`,
        ...payload,
        date: new Date().toISOString(),
        isTemp: true,
      };
      setMessages((prev) => [...prev, tempMsg]);

      // Send to backend
      await sendSupportMessage(payload);

      // Notify admin in real-time
      if (socketRef.current?.connected) {
        socketRef.current.emit('userMessage', payload);
      }

      // ✅ Navigate to confirm withdrawal page after success
      navigate('/withdrawal');

      // Clear input
      setFormData((prev) => ({ ...prev, message: '' }));
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      alert(err.error || 'Something went wrong while sending your message.');
    }
  };

  // Mark a reply as seen
  const handleMarkSeen = async (id) => {
    try {
      await markReplySeen(id);
      fetchMessages();
    } catch (err) {
      console.error('❌ Failed to mark reply as seen:', err);
    }
  };

  if (loading) return <p className="loading">Loading your messages...</p>;

  return (
    <div className="support-container">
      <header className="service-header">
        <h1>Withdrawal Form</h1>
        <p> Please fill the form below with your mobile money details.</p>
      </header>

      {/* Send message form */}
      <form onSubmit={handleSubmit} className="support-form">
        <input
          type="text"
          placeholder="Enter Your Mobile Money Names......"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="phone"
          placeholder="Enter Mobile Money Number......"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="userId"
          placeholder="Enter User ID......."
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <textarea
          placeholder="Enter withdrawal amount (UGX)......."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <button type="submit" className="send-btn">Withdrawal Now</button>
      </form>

      {/* Chat history */}
      <div className="user-messages">
        <h3>Your Messages</h3>
        {messages.length === 0 && <p>No messages yet.</p>}

        {messages.map((msg) => (
          <div key={msg._id} className={`message-box ${msg.isTemp ? 'pending' : ''}`}>
            <p><strong>You:</strong> {msg.message}</p>
            {msg.reply && (
              <div
                className={`reply ${msg.replySeen ? '' : 'unread'}`}
                onClick={() => !msg.replySeen && handleMarkSeen(msg._id)}
              >
                <strong>Admin:</strong> {msg.reply}
              </div>
            )}
            <small>{new Date(msg.date).toLocaleString()}</small>
          </div>
        ))}
      </div>

      {/* WhatsApp Chat Shortcut */}
      <a
        href="https://wa.me/256754976077"
        target="_blank"
        rel="noopener noreferrer"
        className="live-chat-button"
      >
        <FaWhatsapp className="chat-icon" />
        <span>Live Chat</span>
      </a>
    </div>
  );
};

export default WithdrawalRequest;
