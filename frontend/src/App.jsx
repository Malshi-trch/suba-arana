import React, { useState } from 'react';
import GuestHomePage from './components/GuestHomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HostDashboard from './components/HostDashboard';
import AdminDashboard from './components/AdminDashboard';
import GuestDashboard from './components/GuestDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('guest-dashboard');

  return (
    <div>
      {/* Top Bar to Switch Across All 6 Suba-Arana Screens */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <span className="font-mono text-[11px] text-amber-400 font-semibold">
          Suba-Arana • EC5406 Complete Frontend Prototype
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'home', label: '1. Guest Homepage' },
            { id: 'login', label: '2. Login Page' },
            { id: 'register', label: '3. Register Page' },
            { id: 'guest-dashboard', label: '4. Guest Dashboard & Checkout' },
            { id: 'host', label: '5. Host Dashboard' },
            { id: 'admin', label: '6. Admin Dashboard' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                currentPage === item.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render Selected Screen */}
      {currentPage === 'home' && (
        <GuestHomePage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
      )}
      {currentPage === 'register' && (
        <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'guest-dashboard' && (
        <GuestDashboard
          onNavigateHome={() => setCurrentPage('home')}
          onLogout={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'host' && (
        <HostDashboard onLogout={() => setCurrentPage('login')} />
      )}
      {currentPage === 'admin' && (
        <AdminDashboard onLogout={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;