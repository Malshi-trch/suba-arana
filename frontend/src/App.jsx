import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import GuestHomePage from './components/GuestHomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import GuestDashboard from './components/GuestDashboard';
import HostDashboard from './components/HostDashboard';
import AdminDashboard from './components/AdminDashboard';

// Automatically maps React Router's navigate function to your existing component props
function NavigationWrapper({ children }) {
  const navigate = useNavigate();

  return React.cloneElement(children, {
    onNavigateHome: () => navigate('/'),
    onSwitchToLogin: () => navigate('/login'),
    onNavigateToLogin: () => navigate('/login'),
    onSwitchToRegister: () => navigate('/register'),
    onNavigateToRegister: () => navigate('/register'),
    onLogout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    },
    onLoginSuccess: (role) => {
  const dashboardRoutes = {
    guest: '/guest',
    host: '/host',
    admin: '/admin'
  };

  navigate(dashboardRoutes[role] || '/');
},
  });
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Optional: Global development navigation bar (remove for production) */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <span className="font-mono text-[11px] text-amber-400 font-semibold">
          Suba-Arana Router Mode
        </span>
        <div className="flex gap-2">
          <a href="/" className="hover:text-white">1. Home</a>
          <a href="/login" className="hover:text-white">2. Login</a>
          <a href="/register" className="hover:text-white">3. Register</a>
          <a href="/guest" className="hover:text-white">4. Guest Dashboard</a>
          <a href="/host" className="hover:text-white">5. Host Dashboard</a>
          <a href="/admin" className="hover:text-white">6. Admin Dashboard</a>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<NavigationWrapper><GuestHomePage /></NavigationWrapper>} />
        <Route path="/login" element={<NavigationWrapper><LoginPage /></NavigationWrapper>} />
        <Route path="/register" element={<NavigationWrapper><RegisterPage /></NavigationWrapper>} />
        <Route path="/guest" element={<NavigationWrapper><GuestDashboard /></NavigationWrapper>} />
        <Route path="/host" element={<NavigationWrapper><HostDashboard /></NavigationWrapper>} />
        <Route path="/admin" element={<NavigationWrapper><AdminDashboard /></NavigationWrapper>} />
        
        {/* Catch-all route redirects unknown URLs back to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}