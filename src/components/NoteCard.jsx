export default function NoteCard({ note, onEdit, onDelete }) {
  const date = new Date(note.createdAt).toLocaleString();
  const loc = note.location;

  return (
    <article className="card">
      {note.photo && <img className="photo" src={note.photo} alt={note.title} />}
      <h3>{note.title}</h3>
      {note.text && <p>{note.text}</p>}
      <p className="small">{date}</p>
      {loc && (
        <p className="small">
          <a
            href={`https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=17/${loc.lat}/${loc.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            View on map ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
          </a>
        </p>
      )}
      <div className="row">
        <button className="btn" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="btn danger" onClick={() => onDelete(note)}>
          Delete
        </button>
      </div>
    </article>
  );
}
