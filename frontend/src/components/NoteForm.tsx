import React, { useState } from 'react';

interface NoteFormProps {
  onCreate: (title: string, content: string) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onCreate(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default NoteForm;
