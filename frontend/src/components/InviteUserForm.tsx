import React, { useState } from 'react';
import '../styles/InviteUserForm.css';

interface InviteUserFormProps {
  onInvite: (email: string, role: 'Admin' | 'Member') => void;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Member'>('Member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onInvite(email, role);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="invite-form">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <select value={role} onChange={e => setRole(e.target.value as 'Admin' | 'Member')}>
        <option value="Member">Member</option>
        <option value="Admin">Admin</option>
      </select>
      <button type="submit">Invite User</button>
    </form>
  );
};

export default InviteUserForm;