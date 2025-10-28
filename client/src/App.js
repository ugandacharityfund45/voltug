// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===== Public Pages =====
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetTokenPage from './pages/ResetTokenPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// ===== User Pages =====
import InvestmentPlatform from './pages/InvestmentPlatform';
import DailyTasksPage from './pages/DailyTasksPage';
import Transactions from './pages/Transactions';
import CustomerServicePage from './pages/CustomerServicePage';
import ConfirmDeposit from './pages/DepositConfirmation';
import WithdrawalPage from './pages/WithdrawalPage';

// ===== Admin Pages =====
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDepositsApproval from './pages/AdminDepositsApproval';
import AdminWithdrawalsApproval from './pages/AdminWithdrawalsApproval';
//import AdminSupportDashboard from './pages/AdminSupportDashboard';
import AdminUserRequests from './pages/AdminUserRequests'
import AdminUsersControl from './pages/AdminUsersControl'

// ===== Context & Routes =====
import AuthProvider from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// ===== App Component =====
const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          


          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route
            path="/platform"
            element={
              <PrivateRoute>
                <InvestmentPlatform />
              </PrivateRoute>
            }
          />
          <Route
            path="/daily-tasks"
            element={
              <PrivateRoute>
                <DailyTasksPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/withdrawal"
            element={
              <PrivateRoute>
                <WithdrawalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customerservice"
            element={
              <PrivateRoute>
                <CustomerServicePage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/confirm-deposit" 
             element={
              <PrivateRoute>
                <ConfirmDeposit />
              </PrivateRoute>
           } 
          />

          {/* ================= ADMIN AUTH ROUTES ================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/portal" element={<AdminRegisterPage />} />

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="deposits" element={<AdminDepositsApproval />} />
            <Route path="withdrawals" element={<AdminWithdrawalsApproval />} />
            <Route path="resttoken" element={<ResetTokenPage />} />
            <Route path="requests" element={<AdminUserRequests />} />
            <Route path="users-control" element={<AdminUsersControl />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
