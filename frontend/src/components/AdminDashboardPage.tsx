import React, { useEffect, useState } from 'react';
import api from '../api/client';
import InviteUserForm from './InviteUserForm';
import UpgradeButton from './UpgradeButton';
import Modal from './Modal';

interface Stats {
  totalUsers: number;
  adminUsers: number;
  memberUsers: number;
  totalNotes: number;
}

interface TenantInfo {
  plan: string;
  name: string;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, adminUsers: 0, memberUsers: 0, totalNotes: 0 });
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({ plan: 'free', name: 'Loading...' });
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchTenantInfo();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStatsRes, notesRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/notes')
      ]);
      
      setStats({
        ...userStatsRes.data,
        totalNotes: notesRes.data.length
      });
    } catch {
      setError('Failed to load statistics');
    }
  };

  const fetchTenantInfo = async () => {
    try {
      const res = await api.get('/tenants/info');
      setTenantInfo(res.data);
    } catch {
      setError('Failed to load tenant info');
    }
  };

  const handleUpgradeSuccess = () => {
    fetchTenantInfo();
    fetchStats();
  };

  const handleInviteUser = async (email: string, role: 'Admin' | 'Member') => {
    try {
      await api.post('/users/invite', { email, role });
      alert('User invited successfully!');
      setShowInviteModal(false);
      fetchStats();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to invite user');
      } else {
        setError('Failed to invite user');
      }
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <small>{stats.adminUsers} admins, {stats.memberUsers} members</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalNotes}</h3>
            <p>Total Notes</p>
            {tenantInfo.plan === 'free' && (
              <small>{Math.max(0, 3 - stats.totalNotes)} notes remaining</small>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{tenantInfo.plan}</h3>
            <p>Current Plan</p>
            <small>{tenantInfo.name}</small>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <div className="action-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => setShowInviteModal(true)}
            >
              Invite User
            </button>
            {tenantInfo.plan === 'free' && (
              <UpgradeButton onUpgradeSuccess={handleUpgradeSuccess} />
            )}
          </div>
        </div>
        
        <div className="action-section">
          <h3>Subscription Management</h3>
          {tenantInfo.plan === 'free' && (
            <div className="subscription-info">
              <p>Free Plan: Limited to 3 notes</p>
              <p>Upgrade to Pro for unlimited notes and advanced features</p>
            </div>
          )}
          {tenantInfo.plan === 'pro' && (
            <div className="subscription-info">
              <p>Pro Plan: Unlimited notes</p>
              <p>Thank you for being a Pro subscriber!</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
      >
        <InviteUserForm onInvite={handleInviteUser} />
      </Modal>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AdminDashboardPage;