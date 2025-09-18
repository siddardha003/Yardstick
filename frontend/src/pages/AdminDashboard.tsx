import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboardPage from '../components/AdminDashboardPage';
import AdminUsersPage from '../components/AdminUsersPage';
import AdminNotesPage from '../components/AdminNotesPage';
import '../styles/AdminDashboard.css';

type AdminTab = 'dashboard' | 'users' | 'notes';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'users':
        return <AdminUsersPage />;
      case 'notes':
        return <AdminNotesPage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <div className="buttons-grp">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >Dashboard</button>
         <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      </div>

      <div className="admin-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;