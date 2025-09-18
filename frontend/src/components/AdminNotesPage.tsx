import React, { useEffect, useState } from 'react';
import api from '../api/client';
import NoteForm from './NoteForm';

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
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowAddForm(false); // Hide add form if open
  };

  const handleUpdate = async (title: string, content: string) => {
    if (!editingNote) return;
    
    try {
      await api.put(`/notes/${editingNote._id}`, { title, content });
      setEditingNote(null);
      fetchNotes(); // Refresh notes list
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

      {/* Edit note form */}
      {editingNote && (
        <div className="edit-note-section">
          <h3>Edit Note</h3>
          <NoteForm 
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={handleCancelEdit}
            initialTitle={editingNote.title}
            initialContent={editingNote.content}
            isEditing={true}
          />
        </div>
      )}

     
      <div className="notes-grid">
        {notes.map(note => (
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