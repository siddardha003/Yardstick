import React, { useEffect, useState } from 'react';
import api from '../api/client';
import NoteForm from './NoteForm';
import UpgradeButton from './UpgradeButton';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TenantInfo {
  plan: string;
  name: string;
}

const AdminNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({ plan: 'free', name: 'Loading...' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchTenantInfo();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
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
    // Refresh tenant info after successful upgrade
    fetchTenantInfo();
  };

  const handleCreate = async (title: string, content: string) => {
    try {
      await api.post('/notes', { title, content });
      setShowAddForm(false);
      fetchNotes(); // Refresh notes list
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create note');
      } else {
        setError('Failed to create note');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes(); // Refresh notes list
    } catch {
      setError('Failed to delete note');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const canAddMoreNotes = tenantInfo.plan === 'pro' || notes.length < 3;

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h2>Notes Management</h2>
        <div className="header-actions">
          {canAddMoreNotes && (
            <button 
              className="add-note-btn primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Note'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Plan limit warning */}
      {tenantInfo.plan === 'free' && notes.length >= 3 && (
        <div className="plan-limit-warning">
          <div className="warning-content">
            <h3>⚠️ Free Plan Limit Reached</h3>
            <p>You've reached the free plan limit of 3 notes. Upgrade to Pro to add unlimited notes!</p>
            <UpgradeButton onUpgradeSuccess={handleUpgradeSuccess} />
          </div>
        </div>
      )}

      {/* Add note form */}
      {showAddForm && canAddMoreNotes && (
        <div className="add-note-section">
          <h3>Add New Note</h3>
          <NoteForm onCreate={handleCreate} />
        </div>
      )}

      {/* Notes grid */}
      <div className="notes-grid">
        {notes.map(note => (
          <div key={note._id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(note._id)}
                title="Delete note"
              >
                ×
              </button>
            </div>
            <div className="note-content">
              <p>{note.content}</p>
            </div>
            <div className="note-footer">
              <small>Created: {formatDate(note.createdAt)}</small>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <small>Updated: {formatDate(note.updatedAt)}</small>
              )}
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <h3>📝 No notes yet</h3>
            <p>Create your first note to get started!</p>
            {canAddMoreNotes && (
              <button 
                className="add-note-btn primary"
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotesPage;