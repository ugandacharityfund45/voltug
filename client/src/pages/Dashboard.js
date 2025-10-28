import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ user, balance, onNavigate }) => {
  return (
    <div className="dashboard-grid">
      {/* Wallet Summary */}
      <div
        className="dashboard-card wallet-summary clickable"
        onClick={() => onNavigate('wallet')} // <-- changed from 'dashboard' to 'wallet'
      >
        <h2>Wallet Balance</h2>
        <p className="balance-text">UGX {balance.toLocaleString()}</p>
        <p className="card-link">View Wallet</p>
      </div>

      {/* Daily Tasks */}
      <div
        className="dashboard-card tasks-summary clickable"
        onClick={() => onNavigate('tasks')}
      >
        <h2>Daily Tasks</h2>
        <p>Check & Complete</p>
        <p className="card-link">Go to Tasks</p>
      </div>

      {/* My Earnings */}
      <div
        className="dashboard-card earnings-summary clickable"
        onClick={() => onNavigate('commissions')}
      >
        <h2>My Earnings</h2>
        <p>Track Rewards</p>
        <p className="card-link">View Earnings</p>
      </div>

      {/* My Team */}
      <div
        className="dashboard-card team-summary clickable"
        onClick={() => onNavigate('team')}
      >
        <h2>My Team</h2>
        <p>See Team Members</p>
        <p className="card-link">View Team</p>
      </div>

                  {/* Customer Service */}

      <div
        className="dashboard-card service-summary clickable"
        onClick={() => onNavigate('customerservice')} // <-- changed from 'dashboard' to 'wallet'
      >
        <h2>Customer Service</h2>
        <p>for account support</p>
        <p className="card-link">services</p>
      </div>

      {/* Deposits & Withdrawals */}
      <div className="recent-activity">
        <h3>Deposit & Withdrawal Conditions</h3>
        <ul>
          <li>✔ Minimum Deposit: UGX 10,000</li>
          <li>✔ Minimum withdrawal: UGX 50,000</li>
          <li>✔ Uncompleted tasks are not credited</li>
          <li>✔ Withdrawal take upto 24hrs to be approved</li>
          <li>✔ Task Completed: earn 0.1% of wallet balance</li>
          <li>✔ Complete 16 tasks daily to earn more commission</li>
        </ul>
      </div>

      {/* Deposits & Withdrawals */}
      <div className="recent-activity">
        <h3>Tearms & Conditions</h3>
        <ul>
          <li> All users are requested to register with the real numbers as appear on mombile money for quick transactions.</li>
          </ul>

          <ul>
          <li> Account will only be active after making initial deposit or minimum deposite on the account.</li>
          </ul>

          <ul>
          <li> All users have 16 daily tasks to complete everyday and only completed tasks are counted valid and commission credited instantly on user account.</li>
          </ul>

          <ul>
          <li> Uncompleted tasks will not be counted and no commission earned from them.</li>
          </ul>

          <ul>
          <li> Commission earned daily is not fixed since 0.1% of account/wallet balance will be commission earned from each completed task thus earning more commission as account balance grows.</li>
          </ul>

          <ul>
          <li> High account balance generates more commission from tasks daily. </li>
        </ul>
      </div>
      
    
    </div>
  );
};

export default Dashboard;
