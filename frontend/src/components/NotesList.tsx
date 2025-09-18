import React from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NotesListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDelete }) => (
  <ul className="notes-list">
    {notes.map(note => (
      <li key={note._id}>
        <h4>{note.title}</h4>
        <p>{note.content}</p>
        <button onClick={() => onDelete(note._id)}>Delete</button>
      </li>
    ))}
  </ul>
);

export default NotesList;
