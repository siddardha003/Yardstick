import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';
import '../styles/MemberDashboard.css';

const MemberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  interface Note { _id: string; title: string; content: string; }
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch {
      setError('Failed to load notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (title: string, content: string) => {
    try {
      await api.post('/notes', { title, content });
      fetchNotes();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create note');
      } else {
        setError('Failed to create note');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="member-dashboard">
      <div className="member-header">
        <div className="member-info">
          <h1>My Notes</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="member-section">
        <h3>Create New Note</h3>
        <NoteForm onCreate={handleCreate} />
        
        <h3>Your Notes <span className="notes-count">({notes.length})</span></h3>
        <NotesList notes={notes} onDelete={handleDelete} />
        
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default MemberDashboard;