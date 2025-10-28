import React from "react";
import "../styles/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>⚡ About Volt Investment Uganda </h1>
        <p>Your trusted partner in smart investments and financial growth.</p>
      </header>

      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          <b>Volt Uganda Investment Platform</b> is a digital investment hub
          created to empower Ugandans to take control of their financial future.
          We believe that every individual deserves a simple and transparent way
          to grow their income daily through secure and well-managed
          investments.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make investment accessible to everyone in Uganda,
          regardless of background or experience. We aim to provide safe and
          sustainable income opportunities that allow users to grow wealth
          consistently over time.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <ul>
          <li>💼 Register an account with Volt Uganda.</li>
          <li>💳 Deposit funds securely in your wallet.</li>
          <li>📈 Complete daily investment tasks to earn rewards.</li>
          <li>💰 Withdraw your profits anytime with ease.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Why Choose Volt Uganda?</h2>
        <ul>
          <li>✅ Transparent investment process</li>
          <li>✅ Daily income growth from verified tasks</li>
          <li>✅ Instant rewards credited to your wallet</li>
          <li>✅ Secure transactions and user protection</li>
          <li>✅ Dedicated Ugandan support team</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become Uganda’s leading online investment platform that connects
          individuals to reliable financial opportunities, helping communities
          thrive through technology and innovation.
        </p>
      </section>

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

export default AboutPage;
