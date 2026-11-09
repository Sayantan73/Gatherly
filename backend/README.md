# Gatherly API

The Gatherly backend is an Express REST API backed by MongoDB and Mongoose. It handles account authentication, organizer event management, and attendee RSVPs.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database (or another MongoDB deployment)

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB connection string.
3. Set `JWT_SECRET` to a private, random value at least 32 characters long.
4. Install packages with `npm install`.
5. Optionally add the four `SEED_*` values for throwaway organizer and attendee accounts to `.env`, then run `npm run seed` to create the demo accounts and sample events.
6. Run `npm run dev` to start the API at `http://localhost:5000`.
7. Run `npm test` for database-independent tests.

Never commit `.env` or share real credentials. `.env.example` contains placeholders only.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port; defaults to `5000`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Private JWT signing secret, at least 32 characters. |
| `CLIENT_URL` | No | Comma-separated frontend origins allowed by CORS; defaults to `http://localhost:5173`. |
| `TRUST_PROXY` | Hosting only | Trusted reverse-proxy hop count, e.g. `1` when deployed behind one proxy. |
| `SEED_ORGANIZER_EMAIL` | For seeding | Throwaway organizer email. |
| `SEED_ORGANIZER_PASSWORD` | For seeding | Throwaway organizer password (at least 8 characters). |
| `SEED_ATTENDEE_EMAIL` | For seeding | Different throwaway attendee email. |
| `SEED_ATTENDEE_PASSWORD` | For seeding | Throwaway attendee password (at least 8 characters). |

## API routes

Every route is prefixed by `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Health check. |
| `POST` | `/auth/signup` | Public | Create an organizer or attendee account. |
| `POST` | `/auth/login` | Public, rate-limited | Sign in and receive a JWT. |
| `GET` | `/auth/me` | Signed in | Read the current account. |
| `GET` | `/events` | Public | Browse upcoming active events; supports a `search` query. |
| `GET` | `/events/:id` | Public | Read event details and registration state. |
| `POST` | `/events` | Organizer | Create an event. |
| `GET` | `/events/mine` | Organizer | List the organizer’s own events. |
| `PATCH` | `/events/:id` | Event owner | Edit an event. |
| `POST` | `/events/:id/cancel` | Event owner | Cancel an active event. |
| `GET` | `/events/:id/attendees` | Event owner | List attendee names and emails. |
| `POST` | `/events/:id/register` | Attendee | Reserve one seat. |
| `GET` | `/events/registrations/mine` | Attendee | List the attendee’s registrations. |

## Business rules and security

- Passwords are stored as bcrypt hashes; JWTs expire after seven days.
- Role checks and event ownership checks are enforced by the API, not just the UI.
- Event dates must be in the future. Cancelled or past events cannot be booked.
- Registration uses a conditional atomic MongoDB update, enforcing one registration per attendee and respecting the seat limit under concurrent requests.
- Event edits cannot reduce seat capacity below the number already registered.
- Login attempts are rate-limited. Helmet security headers, request-size limits, JSON validation, and server-side field validation are enabled.

## Project layout

```text
src/
├── app.js                  # Express application and middleware registration
├── config/                 # Environment, database, security, and rate-limit setup
├── controllers/            # Authentication and event handlers
├── middleware/             # Authentication, role checks, request/error handling
├── models/                 # Mongoose schemas and model validation
├── routes/                 # HTTP route definitions
└── utils/                  # Event validation and safe response serialization
test/                       # Node built-in test runner checks
index.js                    # Configuration, MongoDB connection, and server startup
seed.js                     # Fictional events and optional demo accounts
```

## Deployment

Deploy this API to a Node-compatible host and configure environment values in its secret manager. Set `CLIENT_URL` to the frontend origin and `TRUST_PROXY=1` if the host uses a single reverse proxy. Configure Atlas network access for the host. Free hosting plans may sleep while idle; the first request can take a few seconds.
