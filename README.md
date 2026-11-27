# Place Journal

A mobile-first React Progressive Web App (PWA). Save short notes together with a photo and your GPS location.

## Features
- **CRUD** with IndexedDB (Dexie): create, read, update, delete notes. Data stays after closing the app.
- **Device API 1 – Geolocation**: add your current position to a note.
- **Device API 2 – Camera** (`getUserMedia`): take a photo for a note.
- **PWA**: web manifest + service worker, so the app can be installed and works offline.
- Extras: search, JSON export, online/offline badge, custom hook, GitHub Actions CI, Vercel deployment.

## Requirements
- Node.js 18 or newer (https://nodejs.org, choose the LTS version)
- npm (installed with Node.js)

## Install and run
```bash
git clone <YOUR-REPO-URL>
cd place-journal
npm install
npm run dev
```
Open http://localhost:5173 in Chrome. (`localhost` counts as a secure origin, so camera and location work.)

## Production build and offline test
```bash
npm run build
npm run preview
```
Open http://localhost:4173, then in Chrome DevTools > Application > Service Workers tick **Offline** and refresh.

## Deploy (Vercel)
Import the GitHub repo in Vercel. Framework preset: Vite. Build command `npm run build`, output folder `dist`.
Camera and location need HTTPS, which Vercel provides.

## Project structure
```
src/
  main.jsx            entry point + service worker registration
  App.jsx             main screen, state, CRUD handlers
  db.js               Dexie database + create/read/update/delete functions
  hooks/useGeolocation.js
  components/NoteForm.jsx, NoteList.jsx, NoteCard.jsx, CameraCapture.jsx
public/
  manifest.webmanifest, sw.js, icons
```
