import NoteCard from './NoteCard.jsx';

export default function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return <p className="empty">No notes yet. Tap “+ New” to add your first one.</p>;
  }
  return (
    <div className="list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
