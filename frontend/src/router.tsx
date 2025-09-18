import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import { useAuth } from './hooks/useAuth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  return user.role === 'Admin' ? <AdminDashboard /> : <MemberDashboard />;
};

const AppRouter: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardRoute /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRouter;
