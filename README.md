# PragnyX — Chartered Accountant Firm Management Website

A MERN-stack business website and client-management portal built against the PragnyX Full Stack Developer technical assignment. The project includes a public CA-firm website, client account area, consultation booking workflow, service requests, inquiry management, and a role-protected admin dashboard.

## Features implemented

- Responsive public pages: Home, About Us, Services, Service Details, and Contact Us.
- Eight CA services from the assignment: Income Tax Filing; GST Registration and Filing; Company Registration; Accounting and Bookkeeping; Tax Planning and Consultancy; Auditing Services; Financial Advisory; Business Compliance.
- Client registration and login with bcrypt password hashing, JWT authentication, protected client routes, and profile editing.
- Client portal for consultation status, service requests, and contact inquiry history.
- Consultation booking with required fields, future-date validation, MongoDB persistence, and admin status changes.
- Inquiry form and admin inquiry workflow.
- Admin dashboard with client, inquiry, booking, service-request and service views; service create/archive actions and status management.
- REST API, request validation, centralized errors, security headers, CORS configuration, and API rate limiting.

## Technology

**Frontend:** React, React Router, Vite, Axios, Lucide React, responsive CSS.  
**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, Helmet, CORS.  
**Database:** MongoDB.

## Repository structure

```text
client/
  src/
    components/   Shared layout, protected route, service and account forms
    context/      Authentication state
    lib/          Axios API client
    pages/        Website, booking, client and admin pages
server/
  src/
    config/       MongoDB connection
    controllers/  REST endpoint handlers
    middleware/   Authentication, authorization and error handling
    models/       User, Service, Inquiry, Booking and ServiceRequest
    routes/       API route definitions
    scripts/      Database seed script
docs/             Architecture notes and assignment checklist
```

## Requirements

- Node.js 20 or later
- npm
- MongoDB local instance or MongoDB Atlas database

## Run locally

### 1. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set your own values:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/pragnyx_ca_firm
JWT_SECRET=use-a-long-random-secret-value
JWT_EXPIRES_IN=1d
ADMIN_NAME=PragnyX Administrator
ADMIN_EMAIL=admin@your-domain.example
ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-characters
```

Seed the eight services and optionally create the first administrator:

```bash
npm run seed
npm run dev
```

The API starts at `http://localhost:5000`; health check: `http://localhost:5000/health`.

The seed command creates an admin account only when all three `ADMIN_*` settings are supplied. It does not create a hard-coded default administrator. Keep the real `.env` file private.

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LINKEDIN_URL=https://www.linkedin.com/company/your-firm
VITE_INSTAGRAM_URL=https://www.instagram.com/your-firm
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

Create a normal client account through Register. Sign in to the administrator account created by the seed command to access `/admin`.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create client account |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Client/Admin | Current user |
| PATCH | `/api/auth/profile` | Client/Admin | Update name and phone |
| GET | `/api/services` | Public | List active services |
| GET | `/api/services/:slug` | Public | Service detail |
| POST | `/api/services` | Admin | Create a service |
| PATCH | `/api/services/:id` | Admin | Update a service |
| DELETE | `/api/services/:id` | Admin | Archive a service |
| POST | `/api/inquiries` | Public | Submit contact inquiry |
| GET | `/api/inquiries/mine` | Client | Client inquiry history |
| GET | `/api/inquiries` | Admin | List inquiries |
| PATCH | `/api/inquiries/:id/status` | Admin | Update inquiry status |
| POST | `/api/bookings` | Client | Request consultation |
| GET | `/api/bookings/mine` | Client | Client bookings |
| GET | `/api/bookings` | Admin | All bookings |
| PATCH | `/api/bookings/:id/status` | Admin | Approve/reject/complete booking |
| POST | `/api/service-requests` | Client | Submit service request |
| GET | `/api/service-requests/mine` | Client | Client service requests |
| GET | `/api/service-requests` | Admin | All service requests |
| PATCH | `/api/service-requests/:id/status` | Admin | Update service request |
| GET | `/api/admin/stats` | Admin | Dashboard counts |
| GET | `/api/admin/clients` | Admin | Registered clients |

Send protected API requests with `Authorization: Bearer <token>`.

## Database collections

- **User:** name, email, phone, password hash, role, active flag.
- **Service:** name, unique slug, short/full description, icon, active flag.
- **Inquiry:** optional user reference, contact details, subject, message, status.
- **Booking:** client reference and contact details, requested service/date/time, message, status and admin note.
- **ServiceRequest:** client reference, service, details, status and admin note.

## Security notes

- Passwords are hashed with bcryptjs and are never returned by user API responses.
- Public registration always creates a `client`; administrator role is assigned only by the controlled seed process.
- Admin API routes enforce role-based authorization on the server.
- Booking dates are validated as real calendar dates on the backend as well as in the browser.
- Secrets belong in local environment variables or deployment secret settings, never in Git.
- This is an assignment implementation. Before production use, consider moving JWTs to secure HttpOnly cookies, adding email verification/password reset, audit logging, CSRF protections as applicable, and more comprehensive automated tests.

## Automated API tests

The backend uses the Node.js test runner and Supertest. Integration tests connect to a disposable MongoDB database and exercise real Express routes.

```bash
cd server
npm install
MONGODB_URI=mongodb://127.0.0.1:27017/pragnyx_test JWT_SECRET=local-test-secret-with-enough-entropy npm test
```

The integration test suite clears its configured test database before and after the run. **Use a dedicated test database only; never point the test command at a development, staging, or production database.**

GitHub Actions runs three checks on pushes and pull requests to main: the frontend production build, backend JavaScript syntax validation, and MongoDB-backed API integration tests.

## Deployment checklist

Deployment requires accounts and credentials that must be supplied by the project owner:

1. Create a MongoDB Atlas database and a database user. Restrict network access to the deployed API service where practical.
2. Deploy the Node.js API from the `server` directory. Set `NODE_ENV=production`, `PORT` (provided by the host), `MONGODB_URI`, a long random `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, and the exact frontend origin in `CLIENT_URL`.
3. Run `npm run seed` once against the production database. Set `ADMIN_NAME`, `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters for the first administrator. Run this command only against the intended database.
4. Deploy the static frontend from the `client` directory with build command `npm install && npm run build` and publish directory `dist`. Set `VITE_API_BASE_URL` to the deployed API's `/api` URL. Set the firm's real LinkedIn and Instagram URLs.
5. Configure SPA fallback rewrites to `/index.html`, update the API CORS origin to the actual frontend domain, and verify the public `/health` endpoint.
6. Perform the manual smoke-test checklist in `docs/TESTING-AND-DEPLOYMENT.md` and record the final frontend URL, API URL, and separately shared test credentials.

Do not commit production secrets or real administrator credentials. The repository does not currently contain live deployment URLs; these are created by the chosen hosting accounts.

## Assignment reference

See [docs/ASSIGNMENT-CHECKLIST.md](docs/ASSIGNMENT-CHECKLIST.md) for the feature checklist and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the collection schema, relationships, indexes, validation rules and complete API route map. The project should be evaluated against the supplied PragnyX assignment PDF; sample website copy and contact details are placeholders and must be customized before public business use.

## Branch policy

All work for this project is maintained on the single `main` branch.
