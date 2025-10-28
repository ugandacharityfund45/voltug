import React from 'react';

const UserMessagesSection = ({ messages, markSeen }) => (
  <div className="user-messages">
    <h3>Your Messages</h3>
    {messages.length === 0 ? (
      <p>No messages yet.</p>
    ) : (
      messages.map((msg) => (
        <div key={msg._id} className="message-box">
          <p><strong>You:</strong> {msg.message}</p>
          {msg.reply && (
            <div
              className={`reply ${msg.replySeen ? '' : 'unread'}`}
              onClick={() => !msg.replySeen && markSeen(msg._id)}
            >
              <strong>Admin Reply:</strong> {msg.reply}
            </div>
          )}
          <small>{new Date(msg.date).toLocaleString()}</small>
        </div>
      ))
    )}
  </div>
);

export default UserMessagesSection;
