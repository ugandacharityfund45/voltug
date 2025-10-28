import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdGeneratingTokens } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboardLayout.css';
import {
  FaTachometerAlt,
  FaUsers,
  FaExchangeAlt,
  FaCog,
  FaArrowRight,
  FaArrowDown,
} from 'react-icons/fa';

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
    {
      label: 'Transactions',
      icon: <FaExchangeAlt />,
      subItems: [
        { to: '/admin/deposits', label: 'Deposits', colorClass: 'deposit-item',icon: <FaTachometerAlt /> },
        { to: '/admin/withdrawals', label: 'Withdrawals', colorClass: 'withdraw-item', icon: <FaTachometerAlt /> },
      ],
    },
    { to: '/admin/RestToken', label: 'UserTokens', icon: <MdGeneratingTokens /> },
    { to: '/admin/requests', label: 'User Requests', icon: <FaCog /> },

  ];

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isSidebarOpen && <h2>Volt Admin</h2>}
          <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
        </div>

        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className={location.pathname === item.to ? 'active' : ''}>
                {item.subItems ? (
                  <>
                    <div
                      className="sidebar-link"
                      onClick={() => setTransactionsOpen(!transactionsOpen)}
                    >
                      <span className="icon">{item.icon}</span>
                      {isSidebarOpen && (
                        <>
                          <span className="label">{item.label}</span>
                          <span className="submenu-arrow">
                            {transactionsOpen ? <FaArrowDown /> : <FaArrowRight />}
                          </span>
                        </>
                      )}
                      {!isSidebarOpen && <span className="tooltip">{item.label}</span>}
                    </div>

                    {transactionsOpen && (
                      <ul className={`submenu ${isSidebarOpen ? 'open' : 'closed'}`}>
                        {item.subItems.map((sub) => (
                          <li
                            key={sub.to}
                            className={`${location.pathname === sub.to ? 'active' : ''} ${sub.colorClass}`}
                          >
                            <Link to={sub.to} className="sidebar-link">
                              {isSidebarOpen ? (
                                <span className="label">{sub.label}</span>
                              ) : (
                                <span className="tooltip">{sub.label}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link to={item.to} className="sidebar-link">
                    <span className="icon">{item.icon}</span>
                    {isSidebarOpen && <span className="label">{item.label}</span>}
                    {!isSidebarOpen && <span className="tooltip">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Welcome, {user?.username || 'Admin'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
