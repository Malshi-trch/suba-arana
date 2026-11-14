# Suba-Arana dashboard redesign

## Dashboard UI
- Guest dashboard: live reservations, pending requests, saved stays and booking history.
- Host dashboard: live property portfolio, incoming reservations, accept/decline actions, listing submission and confirmed booking value.
- Admin dashboard: live property approval queue, user directory and database-backed platform metrics.

## Stitch design direction
The dashboard design follows the host management portal reference in `frontend/design-reference/stitch/host_guest_management_portal/` and the shared Suba-Arana identity: warm ivory surfaces, forest green, muted gold accents, Playfair Display headings and compact sans-serif interface text. Guest and admin screens use the same system with role-appropriate navigation and information hierarchy.

## Backend additions and security
- Added admin-only `GET /api/admin/overview` and `GET /api/admin/users` endpoints.
- Admin user directory excludes password hashes.
- Booking updates now enforce ownership and allowed actions: hosts may confirm/decline bookings for their own properties; guests may cancel their own bookings only.
- Existing login, registration, listing, booking and role-based routes are retained.

## Functional boundaries
- Guest payment processing, reviews, in-app messaging, host payouts, platform commissions, traffic analytics and user deactivation are not implemented by the existing backend. The new dashboards do not pretend these actions are live; they show available database-backed information and label unavailable financial functions.
- Favorites are stored in the browser's local storage and synchronized between the homepage and guest dashboard.

## Setup
1. Extract the project ZIP.
2. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` and a private `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env`.
4. Run backend in one VS Code terminal: `cd backend`, `npm install`, `npm run dev`.
5. Run frontend in another terminal: `cd frontend`, `npm install`, `npm run dev`.
6. Sign in using accounts with guest, host or admin roles to open the corresponding dashboard.
