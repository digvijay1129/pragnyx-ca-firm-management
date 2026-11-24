# Architecture and Database Notes

## Application architecture

The project uses a React/Vite client and a Node.js/Express API. The API connects to MongoDB through Mongoose. The browser calls the API through the shared Axios client.

### Application areas

1. Public website: home, about, services, service details, and contact.
2. Authentication: registration, login, JWT verification, profile, and role-aware access.
3. Client portal: profile, service requests, inquiry history, bookings, and booking status.
4. Admin portal: overview metrics, services, clients, inquiries, and consultation bookings.

## Database collections

All collections use Mongoose timestamps (createdAt and updatedAt).

| Collection | Main fields | Relationships and purpose |
|---|---|---|
| User | name, email, phone, password, role, isActive | Account for a client or administrator. Email is unique. Password is selected out of normal queries and hashed with bcrypt before save. |
| Service | name, slug, shortDescription, description, icon, isActive | Publicly displayed CA service. Slug is unique. Archived services are hidden from public listing but retained in MongoDB. |
| Inquiry | user, name, email, phone, subject, message, status | Contact request. user is optional so visitors can submit an inquiry without signing in. |
| Booking | user, name, email, phone, service, preferredDate, preferredTime, message, status, adminNote | Consultation request. user is required. Service is stored as a name snapshot so historical bookings remain readable if a service is later renamed or archived. |
| ServiceRequest | user, service, details, status, adminNote | A signed-in client's request for a CA service. user is required. |

### Relationships

- One User can have many Bookings.
- One User can have many ServiceRequests.
- One User can have many Inquiries; an Inquiry may have no User when submitted publicly.
- Booking and ServiceRequest store the selected service name as text, not a MongoDB reference to Service.

### Enumerations

- User.role: client, admin. Public registration creates only client accounts. The seed script is used to create the first administrator.
- Inquiry.status: new, in-progress, resolved.
- Booking.status: pending, approved, rejected, completed.
- ServiceRequest.status: pending, in-progress, approved, rejected, completed.

### Indexes

- User email: unique index.
- Service slug: unique index; additional { isActive, name } index for public listing.
- Inquiry: { status, createdAt } index for administration views.
- Booking: user index; { preferredDate, preferredTime, status } and { createdAt } indexes.
- ServiceRequest: user and createdAt indexes.

## API route map

All API routes are mounted under /api. Protected routes require Authorization: Bearer <JWT>.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /auth/register | Public | Register a client |
| POST | /auth/login | Public | Sign in and issue JWT |
| GET | /auth/me | Signed-in user | Read current profile |
| PATCH | /auth/profile | Signed-in user | Update profile |
| GET | /services | Public | List active services |
| GET | /services/:slug | Public | Read service details |
| POST | /services | Admin | Create a service |
| PATCH | /services/:id | Admin | Update a service |
| DELETE | /services/:id | Admin | Archive a service |
| POST | /inquiries | Public, optional JWT | Submit contact inquiry |
| GET | /inquiries/mine | Signed-in user | List own inquiries |
| GET | /inquiries | Admin | List inquiries |
| PATCH | /inquiries/:id/status | Admin | Update inquiry status |
| POST | /bookings | Signed-in user | Request consultation |
| GET | /bookings/mine | Signed-in user | List own bookings |
| GET | /bookings | Admin | List bookings |
| PATCH | /bookings/:id/status | Admin | Update booking status |
| POST | /service-requests | Signed-in user | Submit service request |
| GET | /service-requests/mine | Signed-in user | List own service requests |
| GET | /service-requests | Admin | List service requests |
| PATCH | /service-requests/:id/status | Admin | Update service request status |
| GET | /admin/stats | Admin | Read dashboard totals |
| GET | /admin/clients | Admin | List client accounts |
| GET | /health | Public | API health response |

## Validation and error handling

- API payloads are checked for expected types, required values, and field length limits.
- Email and phone fields are validated before creating contact records.
- Booking dates must be real YYYY-MM-DD calendar dates and cannot be earlier than the current India-local date. Preferred time uses 24-hour HH:mm.
- Service requests and bookings must reference an active service by its current name.
- Mongoose schema validation and unique constraints provide a second validation layer.
- A centralized error handler returns JSON for validation errors, invalid ObjectIds, duplicate keys, malformed JSON, oversized request bodies, and unexpected server errors.

## Security principles

- Hash passwords with bcrypt; never store plaintext passwords.
- Sign and verify JWTs using environment-provided secrets.
- Enforce authorization on the server, not only in the React UI.
- Public registration creates client accounts only; administrator creation is handled by the seed script and environment configuration.
- Apply Helmet security headers, CORS origin configuration, a JSON body-size limit, and API rate limiting.
- Keep credentials in environment variables and out of version control.

## Runtime configuration

The backend reads configuration from server/.env. See server/.env.example for variable names. MongoDB must be reachable before the API starts listening. The /health endpoint responds after successful database connection and API startup.

## Verification and operational boundaries

The repository includes automated backend integration tests, a Postman collection executed with Newman in CI, and Playwright browser end-to-end tests. GitHub Actions also runs a frontend production build and backend syntax checks. These checks provide repeatable development evidence; they do not replace manual visual acceptance or a smoke test against a deployed environment.

The repository does not itself provision production hosting, a live MongoDB database, real CA-firm contact information, or client/admin credentials for external reviewers. Those must be supplied/configured by the project owner. The brand and contact details shipped in demo mode are sample content and should not be represented as a real professional practice.
