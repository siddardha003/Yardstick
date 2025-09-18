import React, { useState, useEffect } from 'react';

interface NoteFormProps {
  onCreate: (title: string, content: string) => void;
  onUpdate?: (title: string, content: string) => void;
  onCancel?: () => void;
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  onCreate, 
  onUpdate, 
  onCancel,
  initialTitle = '',
  initialContent = '',
  isEditing = false
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    if (isEditing && onUpdate) {
      onUpdate(title, content);
    } else {
      onCreate(title, content);
      setTitle('');
      setContent('');
    }
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
      <div className="note-form-buttons">
        <button type="submit">
          {isEditing ? 'Update Note' : 'Add Note'}
        </button>
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
