<div align="center">

# PragnyX
### Chartered Accountant Firm Management Platform

A full-stack MERN application for a CA firm's public website, client workspace, consultation bookings, service requests, and administrative operations.

[![Application Checks](https://github.com/digvijay1129/pragnyx-ca-firm-management/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/digvijay1129/pragnyx-ca-firm-management/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Private%20Assignment-lightgrey)](#)

**[Repository](https://github.com/digvijay1129/pragnyx-ca-firm-management) · [Issues](https://github.com/digvijay1129/pragnyx-ca-firm-management/issues) · [Actions](https://github.com/digvijay1129/pragnyx-ca-firm-management/actions)**

</div>

---

## Overview

PragnyX is a Chartered Accountant firm management website built for the **PragnyX MERN Stack Full Stack Developer technical assignment**. It brings the public-facing firm website and the internal client/admin workflows into one application.

Visitors can explore the firm's services and send an inquiry. Registered clients can request services, book consultations, manage their profile, and review request statuses. Administrators can view dashboard statistics, clients, inquiries, bookings, service requests, and manage the service catalogue.

> **Assignment/demo notice:** PragnyX is a fictional demonstration brand for this project. The sample contact details, social links, location, and testimonials are not real business information. Demo mode is enabled by default; form submissions are stored in the configured database and are not sent to a real CA firm.

## Project highlights

- Responsive public website with Home, About, Services, Service Details, and Contact pages.
- Eight CA service categories from the assignment.
- Client registration/login, bcrypt password hashing, JWT sessions, protected routes, and profile updates.
- Client portal for consultation bookings, service requests, inquiry history, and statuses.
- Consultation booking with required contact/service/date/time details and server-side past-date validation.
- Admin dashboard with totals, registered clients, inquiries, bookings, service requests, and service catalogue management.
- Server-side role-based authorization for administrator routes.
- MongoDB/Mongoose persistence, input validation, centralized API error handling, Helmet, CORS, and rate limiting.
- Automated API integration tests, Postman/Newman collection, Playwright browser tests, and GitHub Actions CI.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, React Router, Vite, Axios, JavaScript, HTML5, CSS3, Lucide React |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB, Mongoose |
| Authentication & security | JWT, bcryptjs, Helmet, CORS, express-rate-limit |
| Testing | Node.js Test Runner, Supertest, Postman/Newman, Playwright |
| Tooling | npm, Git, GitHub Actions |

## Feature modules

### Public website
- Home page with brand/navigation, hero, firm introduction, services, value proposition, testimonials, and footer.
- About Us page.
- Services catalogue and individual service detail pages.
- Contact Us form with full name, email, phone, subject, and message.
- Responsive navigation and mobile layout.

### CA services
1. Income Tax Filing
2. GST Registration & Filing
3. Company Registration
4. Accounting & Bookkeeping
5. Tax Planning & Consultancy
6. Auditing Services
7. Financial Advisory
8. Business Compliance

Each service has a name, URL slug, short description, full description, icon identifier, and active/archive state.

### Client portal
- Register and sign in.
- View and update profile details.
- Submit service requests.
- Request consultations by selecting a service and preferred date/time.
- View consultation, service request, and inquiry history with current statuses.

### Admin portal
- Separate admin-only access enforced by API middleware.
- Dashboard statistics and registered client list.
- Review and update inquiry statuses.
- Approve, reject, or complete consultation bookings.
- Review and update service request statuses.
- Create, edit, and archive services. Archiving hides a service from the public catalogue while preserving historical records.

## Application pages

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| About Us | `/about` | Public |
| Services | `/services` | Public |
| Service Details | `/services/:slug` | Public |
| Contact Us | `/contact` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Consultation Booking | `/booking` | Page is public; submission requires client login |
| Client Dashboard | `/dashboard` | Authenticated client |
| Admin Dashboard | `/admin` | Authenticated administrator |

## Architecture

The application uses a feature-oriented React frontend and an Express REST API. The API applies validation and authorization before Mongoose reads/writes MongoDB.

```text
Browser
  |
  | React + React Router + Axios
  v
Express REST API (/api)
  |
  +-- Authentication & role middleware
  +-- Controllers / validation / error handling
  |
  v
MongoDB (Mongoose)
  |
  +-- User
  +-- Service
  +-- Inquiry
  +-- Booking
  +-- ServiceRequest
```

### Repository structure

```text
.
├── client/
│   ├── e2e/                       # Playwright browser tests
│   ├── src/
│   │   ├── app/                   # Route composition
│   │   ├── data/                  # Local reference/fallback service data
│   │   ├── features/
│   │   │   ├── admin/             # Admin dashboard and tables
│   │   │   ├── auth/              # Login, registration and auth context
│   │   │   ├── booking/           # Consultation booking
│   │   │   ├── client/            # Client dashboard, profile and requests
│   │   │   └── public/            # Public-facing pages
│   │   ├── shared/                # Shared layout, components, routing and API
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/                # MongoDB connection
│   │   ├── controllers/
│   │   ├── middleware/            # JWT/role auth and error handling
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/
│   │   ├── scripts/               # Service/admin seed script
│   │   └── utils/                 # Async handler and validators
│   ├── test/                      # API integration tests
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSIGNMENT-CHECKLIST.md
│   ├── BRAND-GUIDELINES.md
│   ├── FRONTEND-ARCHITECTURE.md
│   └── TESTING-AND-DEPLOYMENT.md
├── postman/
│   └── PragnyX_CA_Firm_Management.postman_collection.json
└── .github/workflows/             # GitHub Actions CI
```

## Getting started

### Prerequisites

- Node.js 20 or newer and npm.
- MongoDB running locally or a MongoDB Atlas connection string.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/digvijay1129/pragnyx-ca-firm-management.git
cd pragnyx-ca-firm-management
```

### 2. Configure and start the backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and configure the values:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/pragnyx_ca_firm
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d

# Optional first administrator account
ADMIN_NAME=PragnyX Administrator
ADMIN_EMAIL=admin@your-domain.example
ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-characters
```

Generate a strong private JWT secret; do not use the example value in a deployed environment. To create the first administrator, set all three `ADMIN_*` values. The seed script creates/updates that administrator and seeds the eight services:

```bash
npm run seed
npm run dev
```

The API will be available at `http://localhost:5000`. Health endpoint: `http://localhost:5000/health`.

### 3. Configure and start the frontend

Open a second terminal:

```bash
cd client
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=true
VITE_LINKEDIN_URL=https://www.linkedin.com/
VITE_INSTAGRAM_URL=https://www.instagram.com/
VITE_FIRM_EMAIL=hello@pragnyx.example
VITE_FIRM_PHONE=+91 00000 00000
VITE_FIRM_HOURS=Monday-Friday, 9:30 AM-6:30 PM (sample hours)
VITE_FIRM_LOCATION=Demo location - India (no physical office)
```

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Sign in

- Create a client account using the **Register** page.
- Sign in with the administrator credentials configured in `server/.env` and created by `npm run seed` to access `/admin`.
- Do not add real passwords, JWTs, or production credentials to this repository or README.

## Environment variables

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | Runtime mode; use `production` when deployed |
| `PORT` | No | API port; defaults to 5000 |
| `CLIENT_URL` | No | Allowed frontend origin for CORS |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes for auth | Private JWT signing secret |
| `JWT_EXPIRES_IN` | No | JWT lifetime; defaults to `1d` |
| `ADMIN_NAME` | Optional | First admin display name |
| `ADMIN_EMAIL` | Optional | First admin email; must be set with password |
| `ADMIN_PASSWORD` | Optional | First admin password; minimum 12 characters and maximum 72 UTF-8 bytes |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API base URL, normally ending in `/api` |
| `VITE_DEMO_MODE` | Keep `true` for assignment/demo display |
| `VITE_LINKEDIN_URL`, `VITE_INSTAGRAM_URL` | Sample social destinations; replace with authorised firm profiles |
| `VITE_FIRM_EMAIL`, `VITE_FIRM_PHONE` | Public contact details |
| `VITE_FIRM_HOURS`, `VITE_FIRM_LOCATION` | Public business hours and location |

Vite variables are public and are embedded in the browser bundle. Never put secrets in `VITE_*` variables. The project keeps the demo disclosure enabled unless explicitly disabled and the required contact values are configured. Only disable demo mode when the owner has supplied and approved real business details.

## REST API reference

All API routes below are mounted under `/api`. Protected requests use:

```http
Authorization: Bearer <JWT>
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a client account |
| POST | `/auth/login` | Public | Authenticate and return a JWT |
| GET | `/auth/me` | Signed-in user | Read the current account |
| PATCH | `/auth/profile` | Signed-in user | Update name and phone |
| GET | `/services` | Public | List active CA services |
| GET | `/services/:slug` | Public | Read service details |
| POST | `/services` | Admin | Create service |
| PATCH | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Archive service |
| POST | `/inquiries` | Public / optional auth | Submit contact inquiry |
| GET | `/inquiries/mine` | Signed-in user | Read own inquiries |
| GET | `/inquiries` | Admin | List inquiries |
| PATCH | `/inquiries/:id/status` | Admin | Update inquiry status |
| POST | `/bookings` | Signed-in client | Create consultation request |
| GET | `/bookings/mine` | Signed-in client | Read own bookings |
| GET | `/bookings` | Admin | List consultation bookings |
| PATCH | `/bookings/:id/status` | Admin | Update booking status |
| POST | `/service-requests` | Signed-in client | Submit service request |
| GET | `/service-requests/mine` | Signed-in client | Read own service requests |
| GET | `/service-requests` | Admin | List service requests |
| PATCH | `/service-requests/:id/status` | Admin | Update service request status |
| GET | `/admin/stats` | Admin | Dashboard counts |
| GET | `/admin/clients` | Admin | Registered clients |
| GET | `/health` | Public | API health status |

## Database design

The application uses five Mongoose collections:

| Collection | Important fields | Purpose |
|---|---|---|
| `User` | name, email, phone, password hash, role, isActive | Client and administrator accounts; email is unique |
| `Service` | name, slug, shortDescription, description, icon, isActive | Public service catalogue; unique slug |
| `Inquiry` | optional user reference, name, email, phone, subject, message, status | Contact messages; supports anonymous visitors |
| `Booking` | client reference, contact details, service, preferred date/time, message, status, admin note | Consultation requests |
| `ServiceRequest` | client reference, service, details, status, admin note | Client requests for specific services |

Passwords are hashed using bcrypt before persistence. Public registration creates client-role accounts only; administrator creation is controlled by the seed script. Booking and service request records keep a service-name snapshot so the historical request remains readable if a catalogue item is later renamed or archived.

For indexes, relationships, field enumerations, validation and route details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Testing and quality checks

### Backend API integration tests

The backend uses Node's built-in test runner and Supertest. Tests connect to a database with a name ending in `_test`; the configured test database is cleared and dropped by the suite.

```bash
cd server
npm install
NODE_ENV=test MONGODB_URI=mongodb://127.0.0.1:27017/pragnyx_ca_firm_test JWT_SECRET=local-test-secret-with-enough-entropy npm test
```

> **Safety:** Use a dedicated disposable test database only. The test suite drops its configured database. Never run it against development, staging, or production data.

### Frontend end-to-end tests

Playwright browser tests cover public pages, mobile navigation/layout, contact submission, client registration/profile/request/booking workflows, administrator status updates, client visibility of updates, and service create/edit/archive.

With a dedicated test database, API and seed administrator available:

```bash
cd client
npm install
npx playwright install chromium
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 E2E_CLIENT_PASSWORD=use-a-test-only-password E2E_ADMIN_EMAIL=admin@example.test E2E_ADMIN_PASSWORD=use-a-test-only-admin-password npm run test:e2e
```

The Playwright configuration starts the frontend development server. Keep test credentials private and use only test data.

### Postman collection

Import `postman/PragnyX_CA_Firm_Management.postman_collection.json` into Postman. Set the API host/port and provide client/admin test credentials in the collection variables. Run against a local or dedicated test environment, never production. The CI workflow executes this collection using Newman.

### Continuous integration

GitHub Actions validates the frontend production build, backend syntax, and MongoDB-backed API integration tests when changes are pushed or pull requests are opened against `main`.

See [GitHub Actions](https://github.com/digvijay1129/pragnyx-ca-firm-management/actions) for current run results. A successful CI run verifies only the checks it executes; it does not prove that production hosting has been configured.

## Assignment compliance and submission checklist

The feature implementation is mapped to the supplied seven-page assignment in [docs/ASSIGNMENT-CHECKLIST.md](docs/ASSIGNMENT-CHECKLIST.md). The PDF's evaluation weights are:

| Evaluation area | Marks |
|---|---:|
| Frontend design & responsiveness | 20 |
| Backend & API development | 20 |
| MongoDB & database design | 15 |
| Authentication & security | 15 |
| Functional implementation | 15 |
| Code quality & GitHub | 5 |
| Testing & deployment | 10 |
| **Total** | **100** |

Before final submission:
- [ ] Verify all ten required pages in a browser.
- [ ] Review desktop, tablet, and mobile layouts and capture screenshots of major modules.
- [ ] Run the Postman collection against the configured API.
- [ ] Create test admin/client credentials and share them securely outside source control.
- [ ] Replace or clearly retain disclaimers for sample contact details and testimonials.
- [ ] Deploy frontend, backend, and database; record the real live URLs.
- [ ] Re-run smoke tests against the deployed application.

The repository currently documents local execution and automated checks. **Live website and backend API URLs are not included because a deployment has not been configured in this repository.** Deployment steps are in [docs/TESTING-AND-DEPLOYMENT.md](docs/TESTING-AND-DEPLOYMENT.md).

## Demo content and production readiness

- Sample email uses the reserved `.example` domain and cannot receive email.
- Phone, location, social links, hours, and testimonials are demonstration content.
- Contact and booking forms persist records in MongoDB; no email notification provider is configured.
- Payment integration is not included; the assignment explicitly states it is not required.
- Before production use, configure real business content, deployment secrets, monitoring, backups, and a reviewed privacy/security policy. Consider secure HttpOnly cookie sessions, CSRF protection as applicable, email verification/password reset, and audit logging.

## Documentation

- [Assignment compliance checklist](docs/ASSIGNMENT-CHECKLIST.md)
- [Architecture and database notes](docs/ARCHITECTURE.md)
- [Frontend architecture](docs/FRONTEND-ARCHITECTURE.md)
- [Brand guidelines](docs/BRAND-GUIDELINES.md)
- [Testing and deployment guide](docs/TESTING-AND-DEPLOYMENT.md)

---

<div align="center">

**PragnyX · MERN Stack Technical Assignment**

Built as an educational/technical demonstration. Not a live professional CA practice.

</div>
