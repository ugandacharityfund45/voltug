import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation hook
import '../styles/DepositPage.css';

const DepositPage = ({ user, onBalanceUpdate }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate function
  const [username, setUsername] = useState(user?.username || '');
  const [network, setNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

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

  const handleConfirmDeposit = (e) => {
    e.preventDefault();

    if (!username || !amount || !phoneNumber) {
      setMessage('⚠️ Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Simulate server confirmation delay
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      setMessage(
        `✅ Please confirm your deposit of UGX ${amount} via ${network} Mobile Money! UGX ${amount} will be credited to your account once the deposit is approved.`
      );

      // Clear inputs
      setAmount('');
      setPhoneNumber('');

      // Optional: Update wallet balance
      onBalanceUpdate && onBalanceUpdate(user?.walletBalance || 0);

      // ✅ Redirect user to DailyTaskPage after confirmation
      setTimeout(() => {
        navigate('/confirm-deposit');
      }, 2000); // 2s delay to allow message visibility
    }, 1500);
  };

  return (
    <div className="deposit-container">
      <h2 className="deposit-title">💸 Deposit Funds</h2>
      <p className="deposit-subtitle">
        Choose your preferred network to get the Number.
      </p>

      <form className="deposit-form" onSubmit={handleConfirmDeposit}>
        {/* Network Selection */}
        <div className="network-select">
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

        {/* Deposit Number Info */}
        <div className="deposit-info-box">
          <p>
           Please fill all required fields to make a deposit 
           to your volt investment account.
          </p>
          <h3 className="deposit-number">{DEPOSIT_NUMBERS[network]}</h3>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label>Amount (UGX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {/* Username Input */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {/* Phone Number Input */}
        <div className="form-group">
          <label>Your Mobile Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 07XXXXXXX"
          />
        </div>

        {/* Deposit Copy Section */}
        <div className="deposit-info-box">
          <p>
            Please copy the {' '} <strong>{network}</strong> number below and transfer  <strong>UGX {amount || 0}</strong> via <strong>{network}</strong> Mobile
             Money. 
            <strong>UGX {amount || 0}</strong> will be transfered direct to your Volt 
            Investment account once deposite is approved. Be sure to double check and 
            confirm the Number below.
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

        {/* Confirm Button */}
        <button type="submit" className="deposit-btn" disabled={loading}>
          {loading ? 'Confirming...' : 'Deposit Now'}
        </button>

        {/* Result Message */}
        {message && (
          <p className={`deposit-message ${confirmed ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default DepositPage;
