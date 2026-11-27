import { useEffect, useMemo, useState } from 'react';
import NoteForm from './components/NoteForm.jsx';
import NoteList from './components/NoteList.jsx';
import { addNote, deleteNote, getAllNotes, updateNote } from './db.js';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = new note, note = edit
  const [search, setSearch] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  const [installEvent, setInstallEvent] = useState(null);

  // Read: load every note from IndexedDB
  async function loadNotes() {
    setNotes(await getAllNotes());
  }

  useEffect(() => {
    loadNotes();
  }, []);

  // Online / offline indicator
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // "Install app" button (PWA)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleSave(data) {
    if (editing && editing.id) {
      await updateNote(editing.id, data); // Update
    } else {
      await addNote(data); // Create
    }
    setEditing(null);
    loadNotes();
  }

  async function handleDelete(note) {
    if (window.confirm(`Delete "${note.title}"?`)) {
      await deleteNote(note.id); // Delete
      loadNotes();
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'place-journal-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function installApp() {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  const visibleNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title + ' ' + n.text).toLowerCase().includes(q));
  }, [notes, search]);

  return (
    <div className="app">
      <header className="header">
        <h1>Place Journal</h1>
        <span className={online ? 'badge on' : 'badge off'}>{online ? 'Online' : 'Offline'}</span>
      </header>

      <main className="main">
        {editing ? (
          <NoteForm
            key={editing.id ?? 'new'}
            initial={editing.id ? editing : null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <div className="row">
              <button className="btn primary" onClick={() => setEditing({})}>
                + New
              </button>
              <button className="btn" onClick={exportJson} disabled={notes.length === 0}>
                Export
              </button>
              {installEvent && (
                <button className="btn" onClick={installApp}>
                  Install app
                </button>
              )}
            </div>
            <input
              className="search"
              type="search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <NoteList notes={visibleNotes} onEdit={setEditing} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  );
}
