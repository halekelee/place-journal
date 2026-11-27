import { useState } from 'react';
import CameraCapture from './CameraCapture.jsx';
import useGeolocation from '../hooks/useGeolocation.js';

// Used for both "Create" (initial = null) and "Update" (initial = an existing note).
export default function NoteForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [text, setText] = useState(initial?.text ?? '');
  const [photo, setPhoto] = useState(initial?.photo ?? null);
  const [showCamera, setShowCamera] = useState(false);
  const [formError, setFormError] = useState('');
  const { position, error, loading, getPosition, clearPosition } = useGeolocation(
    initial?.location ?? null
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please write a title.');
      return;
    }
    onSave({ title: title.trim(), text: text.trim(), photo, location: position });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit note' : 'New note'}</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Nice coffee shop"
      />

      <label htmlFor="text">Notes</label>
      <textarea
        id="text"
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you want to remember?"
      />

      <div className="block">
        {photo && <img className="preview" src={photo} alt="Preview of the saved" />}
        {showCamera ? (
          <CameraCapture
            onCapture={(img) => {
              setPhoto(img);
              setShowCamera(false);
            }}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <div className="row">
            <button type="button" className="btn" onClick={() => setShowCamera(true)}>
              {photo ? 'Retake photo' : 'Add photo'}
            </button>
            {photo && (
              <button type="button" className="btn" onClick={() => setPhoto(null)}>
                Remove photo
              </button>
            )}
          </div>
        )}
      </div>

      <div className="block">
        {position && (
          <p className="small">
            Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)} (±{position.accuracy} m)
          </p>
        )}
        <div className="row">
          <button type="button" className="btn" onClick={getPosition} disabled={loading}>
            {loading ? 'Getting location...' : position ? 'Update location' : 'Add my location'}
          </button>
          {position && (
            <button type="button" className="btn" onClick={clearPosition}>
              Remove location
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {formError && <p className="error">{formError}</p>}

      <div className="row">
        <button type="submit" className="btn primary">
          Save
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
