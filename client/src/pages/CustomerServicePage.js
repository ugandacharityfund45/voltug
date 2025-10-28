import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/CustomerServicePage.css';

const CustomerServicePage = () => {

  return (
    <div className="support-container">
      <header className="service-header">
        <h1>Customer Service</h1>
        <p>We’re here to help you with deposits, withdrawals, and account support.</p>
      </header>

      <section className="support-info">
        <div className="info-card">
          <h2>📞 Contact Us</h2>
          <p><strong>Email:</strong> support@voltug.com</p>
          <p><strong>WhatsApp:</strong> +256 754 976 077</p>
          <p><strong>Hotline:</strong> +256 754 976 077</p>
        </div>
      </section>

      <section className="faq-section">
        <h2>❓ Frequently Asked Questions</h2>
        <ul>
          <li><b>How do I deposit funds?</b><br />Go to the deposit section and click “Deposit Now”.</li>
          <li><b>How long do withdrawals take?</b><br />Usually within 24 hours after approval.</li>
          <li><b>Why was my withdrawal rejected?</b><br />Ensure you meet all rules and balance requirements.</li>
          <li><b>How can I reset my password?</b><br />Use “Forgot Password” on the login page.</li>
        </ul>
      </section>

      {/* WhatsApp Chat Shortcut */}
      <a
        href="https://wa.me/256774527378"
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

export default CustomerServicePage;
