import React, { useEffect, useState } from 'react';
import api from '../api/client';
import InviteUserForm from './InviteUserForm';
import Modal from './Modal';

interface User {
  _id: string;
  email: string;
  role: 'Admin' | 'Member';
  createdAt?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (email: string, role: 'Admin' | 'Member') => {
    try {
      const res = await api.post('/users/invite', { email, role });
      alert(`User invited successfully! Temporary password: ${res.data.temporaryPassword}`);
      setShowInviteModal(false);
      fetchUsers(); // Refresh user list
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to invite user');
      } else {
        setError('Failed to invite user');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users Management</h2>
        <button 
          className="invite-btn primary"
          onClick={() => setShowInviteModal(true)}
        >
          Invite User
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="user-email">{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found. Invite your first user to get started!</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
      >
        <InviteUserForm onInvite={handleInviteUser} />
      </Modal>
    </div>
  );
};

export default AdminUsersPage;