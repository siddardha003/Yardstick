import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';
import UpgradeButton from '../components/UpgradeButton';

const NotesPage: React.FC = () => {
  const { logout } = useAuth();
  interface Note { _id: string; title: string; content: string; }
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [plan] = useState<'free' | 'pro'>('free');

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
      // Optionally fetch plan info
    } catch {
      setError('Failed to load notes');
    }
  };

  useEffect(() => {
    fetchNotes();
    // Optionally fetch plan info from user/tenant
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
    <div>
      <button onClick={logout}>Logout</button>
      <h2>Notes</h2>
      <NoteForm onCreate={handleCreate} />
      <NotesList notes={notes} onDelete={handleDelete} />
      {plan === 'free' && notes.length >= 3 && <UpgradeButton />}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default NotesPage;
