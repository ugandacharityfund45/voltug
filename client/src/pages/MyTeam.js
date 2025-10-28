import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyTeam.css';
import { FaChevronDown, FaChevronRight, FaUsers, FaCopy, FaShareAlt } from 'react-icons/fa';

const MyTeam = () => {
  const [team, setTeam] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState({});
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const fetchUserReferral = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.referralCode) {
            setReferralCode(parsed.referralCode);
            setReferralLink(`https://voltuganda.com/register?ref=${parsed.referralCode}`);
          } else {
            // Fetch from backend if not stored locally
            const res = await axios.get('http://localhost:5000/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const code = res.data.referralCode || '';
            setReferralCode(code);
            setReferralLink(`https://voltuganda.com/register?ref=${code}`);
          }
        }
      } catch (error) {
        console.error('Failed to load referral code:', error);
      }
    };

    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/my-team', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeam(res.data.team || []);
      } catch (error) {
        console.error('Failed to load team data:', error);
      }
    };

    fetchUserReferral();
    fetchTeam();
  }, []);
  

  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const groupByLevel = team.reduce((acc, member) => {
    const level = member.level || 1;
    if (!acc[level]) acc[level] = [];
    acc[level].push(member);
    return acc;
  }, {});

  const levels = Object.keys(groupByLevel).sort((a, b) => a - b);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleWhatsAppShare = () => {
    const message = `Join volt Investment uganda and earn daily! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="team-container">
      <h2 className="team-title">
        <FaUsers className="team-icon" /> My Referral Team
      </h2>

      {/* ✅ Referral Code and Link Section */}
      {referralCode && (
        <div className="referral-section">
          <p className="referral-label">Your Referral Code:</p>
          <div className="referral-box">
            <span className="referral-code">{referralCode}</span>
            <button
              className="copy-btn"
              onClick={() => handleCopy(referralCode, 'Referral code')}
            >
              <FaCopy /> Copy
            </button>
          </div>

          <p className="referral-label">Your Referral Link:</p>
          <div className="referral-box link-box">
            <span className="referral-link">{referralLink}</span>
            <div className="link-actions">
              <button
                className="copy-btn"
                onClick={() => handleCopy(referralLink, 'Referral link')}
              >
                <FaCopy /> Copy
              </button>
              <button className="share-btn" onClick={handleWhatsAppShare}>
                <FaShareAlt /> WhatsApp
              </button>
              <button className="share-btn fb" onClick={handleFacebookShare}>
                <FaShareAlt /> Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="team-total">Total Members: {team.length}</p>

      {levels.length === 0 ? (
        <p className="no-team">You have no referrals yet.</p>
      ) : (
        <div className="team-levels">
          {levels.map((level) => (
            <div key={level} className="team-level-card">
              <div
                className="team-level-header"
                onClick={() => toggleLevel(level)}
              >
                <span className="level-title">
                  {expandedLevels[level] ? (
                    <FaChevronDown className="arrow" />
                  ) : (
                    <FaChevronRight className="arrow" />
                  )}
                  Level {level} ({groupByLevel[level].length} members)
                </span>
              </div>

<div
  className={`team-members ${expandedLevels[level] ? 'expanded' : ''}`}
>
  {expandedLevels[level] &&
    groupByLevel[level].map((user) => (
      <div key={user._id} className="team-member">
        <p>
          <strong>{user.username || user.phone}</strong>
          <br />
          <span>{user.phone}</span>
          <br />
          {/* 💰 Show each member’s account balance */}
          <span className="member-balance">
            Balance: UGX {Number(user.walletBalance || user.commissionEarned || 0).toLocaleString()}
          </span>
        </p>
        <span className="joined-date">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    ))}
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;
