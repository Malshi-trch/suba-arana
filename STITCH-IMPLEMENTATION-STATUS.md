# Suba-Arana Stitch UI implementation

Implemented:
- Added a responsive property detail page at `/property/:id`.
- Added a View details action to listing cards.
- Detail page loads listing data from the existing Express API and submits booking requests to `POST /api/bookings`.
- Added date validation, guest count, host note, price calculation and booking feedback.
- Login now navigates to the correct role dashboard after successful authentication.
- Added a shared Stitch-inspired visual system: forest green, warm cream, muted gold, Playfair Display and DM Sans.
- Preserved existing guest, host and admin dashboard components and their existing API integrations.
- Included original Stitch HTML exports and screen previews under `frontend/design-reference/stitch/`.

Run:
1. Extract ZIP.
2. Copy `backend/.env.example` to `backend/.env` and set your MongoDB URI and a private JWT secret.
3. Copy `frontend/.env.example` to `frontend/.env`.
4. Terminal 1: `cd backend`, `npm install`, `npm run dev` (or the start script in backend/package.json).
5. Terminal 2: `cd frontend`, `npm install`, `npm run dev`.
6. Open the Vite URL shown in the terminal.

Verification notes:
This package was updated from your uploaded source files, but no local MongoDB instance or browser end-to-end test was run here. Confirm each listing has a valid hostId before testing a booking request. Existing dashboards and checkout/payment UI were retained rather than rebuilt as separate payment workflows.
