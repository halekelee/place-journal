// All IndexedDB work lives in this one file (using the Dexie library).
import Dexie from 'dexie';

export const db = new Dexie('PlaceJournalDB');

// "++id" = auto-increment primary key. The other names are indexes we can search/sort by.
db.version(1).stores({
  notes: '++id, title, createdAt',
});

// C - Create
export function addNote(data) {
  const now = Date.now();
  return db.notes.add({ ...data, createdAt: now, updatedAt: now });
}

// R - Read
export function getAllNotes() {
  return db.notes.orderBy('createdAt').reverse().toArray();
}

// U - Update
export function updateNote(id, changes) {
  return db.notes.update(id, { ...changes, updatedAt: Date.now() });
}

// D - Delete
export function deleteNote(id) {
  return db.notes.delete(id);
}
