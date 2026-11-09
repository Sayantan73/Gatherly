# Gatherly

Gatherly is a responsive event discovery and RSVP platform. Organizers can publish and manage limited-capacity events; attendees can browse events, save a seat, and view their registrations.

## Stack

- React 19, Vite, Tailwind CSS 4
- Node.js, Express
- MongoDB Atlas with Mongoose
- JWT authentication and bcrypt password hashing

## Features

- Organizer and attendee accounts with role-protected screens and API routes
- Organizer event creation, editing, cancellation, guest lists, and registration counts
- Attendee event discovery, keyword search, seat availability, and registrations
- Server-side checks for event ownership, future dates, seat limits, duplicate registrations, and event cancellation
- Atomic MongoDB booking update prevents concurrent requests from overbooking an event
- Login rate limiting, Helmet security headers, input validation, and friendly errors
- Responsive layout for phones and desktop
- Seed script creates four sample events and optional throwaway demo accounts

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database (or another MongoDB deployment)

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a private random `JWT_SECRET` of at least 32 characters. Use a throwaway password and email for each optional seed account. Never commit `.env`.
2. In `backend`, run `npm install`.
3. In `frontend`, run `npm install`.
4. To create sample events and demo users, set `SEED_ORGANIZER_EMAIL`, `SEED_ORGANIZER_PASSWORD`, `SEED_ATTENDEE_EMAIL`, and `SEED_ATTENDEE_PASSWORD` in `backend/.env`, then run `npm run seed` from `backend`. Sample users are fictional; use unique demo-only credentials.
5. Start the API with `npm run dev` from `backend`.
6. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:5000/api`.
7. Start the web app with `npm run dev` from `frontend`, then open the Vite URL (normally `http://localhost:5173`).
8. Run backend checks with `npm test` from `backend`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port; defaults to `5000`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Private random signing secret, at least 32 characters. |
| `CLIENT_URL` | No | Allowed frontend origin(s), comma-separated; defaults to `http://localhost:5173`. |
| `TRUST_PROXY` | For reverse-proxy hosting | Set to the trusted proxy hop count (commonly `1` on Render) so login rate limiting uses the client IP. Leave unset for direct local development. |
| `SEED_ORGANIZER_EMAIL` | For seeding | Throwaway email for the sample organizer. |
| `SEED_ORGANIZER_PASSWORD` | For seeding | Throwaway password of at least 8 characters. |
| `SEED_ATTENDEE_EMAIL` | For seeding | Throwaway email for the sample attendee. |
| `SEED_ATTENDEE_PASSWORD` | For seeding | Throwaway password of at least 8 characters. |
| `VITE_API_URL` | No | Backend origin or API base URL. The frontend appends `/api` when omitted; defaults to `/api` (local Vite proxies to port 5000). |

## Data and design decisions

- Passwords are stored only as bcrypt hashes.
- A registration is appended to its event document with one conditional atomic update. MongoDB applies the seat and duplicate-attendee conditions at the same time as the write, so concurrent registrations cannot exceed capacity.
- Event edits and cancellations are scoped to the signed-in organizer. Lowering a capacity below current registrations is rejected.
- The frontend stores the short-lived login session in `sessionStorage`; the persistent event and account data lives in MongoDB.
- Sample profile names and event details are fictional. Event photos are loaded from Unsplash URLs.

## Deployment notes

Deploy the backend and frontend separately, configure the environment variables in the hosting dashboards, set `CLIENT_URL` to the deployed frontend origin, and set `VITE_API_URL` to the deployed backend origin (for example, `https://your-api.example.com`) before building the frontend. The frontend adds `/api` automatically; you can also provide a URL that already ends with `/api`. The backend requires a reachable MongoDB instance and will not start without its database URL and signing secret. Free hosting plans may sleep when idle; allow a few seconds for the first request after inactivity.

This repository does not include a live deployment, GitHub repository URL, or demo credentials. Create throwaway demo accounts using the seed variables for an evaluation deployment, and share those credentials privately with evaluators.

## Known limitations

- Registration cannot be withdrawn by an attendee.
- Event images are selected from curated external URLs; organizer image uploads are not implemented.
- Email confirmations, CSV export, and calendar downloads are not implemented.

## API routes

All routes are prefixed with `/api`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Health check; does not expose database details. |
| `POST` | `/auth/signup` | Public | Create organizer or attendee account. |
| `POST` | `/auth/login` | Public, rate-limited | Sign in and receive a JWT. |
| `GET` | `/auth/me` | Signed in | Return the current account. |
| `GET` | `/events` | Public | Browse upcoming active events; optional `search` query. |
| `GET` | `/events/:id` | Public | Read event details and remaining capacity. |
| `POST` | `/events` | Organizer | Create an event. |
| `GET` | `/events/mine` | Organizer | List events created by the current organizer. |
| `PATCH` | `/events/:id` | Event owner | Edit an event; cannot reduce capacity below current registrations. |
| `POST` | `/events/:id/cancel` | Event owner | Cancel an active event. |
| `GET` | `/events/:id/attendees` | Event owner | Read registered attendees’ names and emails. |
| `POST` | `/events/:id/register` | Attendee | Reserve one seat if the event is active, upcoming, and not full. |
| `GET` | `/events/registrations/mine` | Attendee | List the current attendee’s registrations. |

## Backend structure

```text
backend/
├── index.js                 # Validates configuration, connects to MongoDB, starts HTTP
├── seed.js                  # Creates fictional sample events and demo accounts
├── src/
│   ├── app.js               # Express middleware and route registration
│   ├── config/              # Environment, database, CORS/proxy, rate limiter setup
│   ├── controllers/         # Auth and event request handlers
│   ├── middleware/          # Authentication, role access, JSON and error handling
│   ├── models/              # Mongoose User and Event schemas
│   ├── routes/              # Small endpoint-to-controller mappings
│   └── utils/               # Event validation and safe response serialization
└── test/                    # Node test-runner API and model/validation tests
```

Run `npm test` from `backend` for the database-independent checks. Start the server with `npm run dev`; it validates its environment, connects to MongoDB, initializes model indexes, then listens on the configured port.
