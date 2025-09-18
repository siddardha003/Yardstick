import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import NoteForm from '../components/NoteForm';
import '../styles/MemberDashboard.css';

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

const MemberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({ plan: 'free', name: 'Loading...' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      setNotes(res.data);
      setError(null); // Clear errors on successful fetch
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

  useEffect(() => {
    fetchNotes();
    fetchTenantInfo();
  }, []);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreate = async (title: string, content: string) => {
    try {
      setError(null); // Clear any previous errors
      await api.post('/notes', { title, content });
      setShowAddForm(false);
      fetchNotes();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create note');
      } else {
        setError('Failed to create note');
      }
    }
  };

  const handleEdit = (note: Note) => {
    setError(null); // Clear any errors when opening edit form
    setEditingNote(note);
    setShowAddForm(false);
  };

  const handleUpdate = async (title: string, content: string) => {
    if (!editingNote) return;
    
    try {
      setError(null); // Clear any previous errors
      await api.put(`/notes/${editingNote._id}`, { title, content });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update note');
      } else {
        setError('Failed to update note');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null); // Clear any previous errors
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="member-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>User Dashboard</h1>
            <div className="user-info">
              {user && <span className="user-email">{user.email}</span>}
              {tenantInfo && (
                <div className="tenant-info">
                  <span className="tenant-name">{tenantInfo.name} corp</span>
                  <span className={`plan-badge plan-${tenantInfo.plan}`}>{tenantInfo.plan}</span>
                </div>
              )}
            </div>
          </div>
          <div className="header-right">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setError(null); // Clear any errors when opening add form
                setShowAddForm(true);
                setEditingNote(null);
              }}
            >
              + New Note
            </button>
            <button  onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{notes.length}</div>
            <div className="stat-label">Total Notes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{notes.filter(note => 
              note.updatedAt && new Date(note.updatedAt).toDateString() === new Date().toDateString()
            ).length}</div>
            <div className="stat-label">Updated Today</div>
          </div>
          {tenantInfo?.plan === 'free' && (
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">Total Notes Limit</div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button 
              className="error-close"
              onClick={() => setError(null)}
              title="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Note Form */}
        {showAddForm && (
          <div className="form-section">
            <div className="form-header">
              <h3>Add New Note</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
            <NoteForm onCreate={handleCreate} />
          </div>
        )}

        {/* Edit Note Form */}
        {editingNote && (
          <div className="form-section">
            <div className="form-header">
              <h3>Edit Note</h3>
              <button 
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
            <NoteForm 
              onCreate={() => {}} // Dummy function for editing mode
              onUpdate={handleUpdate}
              initialTitle={editingNote.title}
              initialContent={editingNote.content}
              isEditing={true}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* Notes Grid */}
        <div className="notes-section">
          <div className="section-header">
            <h2>Your Notes ({notes.length})</h2>
          </div>
          
          {loading ? (
            <div className="loading">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Create your first note to get started!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note._id} className="note-card">
                  <div className="note-header">
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(note)}
                        title="Edit note"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(note._id)}
                        title="Delete note"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="note-content">
                    {note.content}
                  </div>
                  <div className="note-footer">
                    <span className="note-date">
                      Updated {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;