
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate
} from 'react-router-dom';

import GuestHomePage from './components/GuestHomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import GuestDashboard from './components/GuestDashboard';
import HostDashboard from './components/HostDashboard';
import AdminDashboard from './components/AdminDashboard';
import PropertyDetailsPage from './components/PropertyDetailsPage';

// Protect dashboard routes using the saved login session and role
function ProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user.role !== allowedRole) {
      const dashboardRoutes = {
        guest: '/guest',
        host: '/host',
        admin: '/admin'
      };

      return (
        <Navigate
          to={dashboardRoutes[user.role] || '/login'}
          replace
        />
      );
    }

    return children;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
}

function NavigationWrapper({ children }) {
  const navigate = useNavigate();

  return React.cloneElement(children, {
    onNavigateHome: () => navigate('/'),
    onViewProperty: (property) =>
      navigate(`/property/${property._id}`, {
        state: { property }
      }),
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
    }
  });
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <NavigationWrapper>
              <GuestHomePage />
            </NavigationWrapper>
          }
        />

        <Route
          path="/login"
          element={
            <NavigationWrapper>
              <LoginPage />
            </NavigationWrapper>
          }
        />

        <Route
          path="/register"
          element={
            <NavigationWrapper>
              <RegisterPage />
            </NavigationWrapper>
          }
        />

        <Route
          path="/guest"
          element={
            <ProtectedRoute allowedRole="guest">
              <NavigationWrapper>
                <GuestDashboard />
              </NavigationWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/host"
          element={
            <ProtectedRoute allowedRole="host">
              <NavigationWrapper>
                <HostDashboard />
              </NavigationWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <NavigationWrapper>
                <AdminDashboard />
              </NavigationWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id"
          element={
            <NavigationWrapper>
              <PropertyDetailsPage />
            </NavigationWrapper>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
