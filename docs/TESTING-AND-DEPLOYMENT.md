# Testing and Deployment Checklist

## Automated tests

The GitHub Actions workflow runs:

- Frontend: install dependencies and create a Vite production build.
- Backend syntax: run Node.js syntax checks across the backend source and test JavaScript files.
- Backend integration: start an isolated MongoDB 7 service and run the Express API integration tests with Node's test runner and Supertest.

The API integration suite covers health response, public service listing, client registration, duplicate registration, password hashing, login, JWT-protected profile, forbidden client access to admin routes, profile updates, authenticated inquiry ownership, admin inquiry status changes, invalid calendar dates, valid bookings, client service requests, booking approval, service request status updates, service create/update/archive, admin statistics and client listing. After these tests, CI starts the API, seeds a CI-only administrator and service catalogue, and runs all 26 requests in `postman/PragnyX_CA_Firm_Management.postman_collection.json` with Newman. The latest successful run recorded **34 assertions, 0 failures**.

## Postman manual API check

Import `postman/PragnyX_CA_Firm_Management.postman_collection.json` into Postman. Configure the collection variables as described in the README. Run the requests against a dedicated local/test database only.

- [ ] Health check and public service listing.
- [ ] Register and log in as a client; verify the returned client JWT.
- [ ] Submit an anonymous inquiry and a signed-in inquiry; verify only the signed-in inquiry appears in that client's history.
- [ ] Submit a future consultation booking and verify it appears in client history.
- [ ] Submit a client service request and verify it appears in client history.
- [ ] Log in as admin; verify statistics, clients, inquiries, bookings and requests.
- [ ] Update an inquiry, booking and service-request status.
- [ ] Create, edit and delete/archive a service; verify it is no longer returned by the public service endpoint.
- [ ] Verify a client token receives 403 on admin endpoints and a missing token receives 401 on protected endpoints.

## Manual end-to-end smoke tests

Run these checks against the actual deployed or local application after environment variables and MongoDB are configured.

### Public website

- [ ] Open Home, About, Services, each Service Details page, and Contact pages.
- [ ] Confirm all eight services appear on the homepage and Services page.
- [ ] Confirm the navigation links and mobile menu work at desktop and mobile widths.
- [ ] Confirm placeholder email, phone, office hours, social links, and sample testimonials have been replaced or clearly approved for demonstration.

### Client experience

- [ ] Register a new client with valid details.
- [ ] Confirm duplicate email and invalid input are rejected with readable messages.
- [ ] Sign out and sign in with that client.
- [ ] Refresh the page and confirm the session is restored.
- [ ] Open the client dashboard and verify profile details.
- [ ] Update the profile and confirm the new values persist after refresh.
- [ ] Submit a service request and confirm it appears in request history.
- [ ] Submit an inquiry while signed in and confirm it appears in inquiry history.
- [ ] Submit a consultation for a future date and confirm it appears with Pending status.
- [ ] Attempt a past date and confirm the API rejects it.
- [ ] Confirm protected client pages redirect visitors who are not signed in.

### Administrator experience

- [ ] Create the first admin using the documented seed process and a private environment variable.
- [ ] Sign in with the administrator account.
- [ ] Confirm the dashboard statistics match the test records.
- [ ] Confirm a client cannot access admin dashboard routes or admin APIs.
- [ ] View registered clients and account status.
- [ ] Create, edit and archive a service; confirm archived services are no longer public.
- [ ] Open an inquiry and update its status.
- [ ] Approve, reject and complete a consultation booking.
- [ ] Update a service request status.
- [ ] Confirm clients can see updated booking and service-request statuses.

### API and production readiness

- [ ] Verify `/health` returns HTTP 200 after the API has connected to MongoDB.
- [ ] Verify the frontend uses the deployed API `/api` base URL.
- [ ] Verify CORS allows the exact deployed frontend origin.
- [ ] Verify direct refreshes on client and admin routes serve the SPA fallback.
- [ ] Confirm the production database, JWT secret, administrator password and API credentials are not committed to Git.
- [ ] Check browser console, server logs and network responses for runtime errors.
- [ ] Confirm no test database or test credentials are used by the production service.

## Deployment record

Fill these values only after deployment has actually completed.

| Item | Final value |
|---|---|
| GitHub repository | https://github.com/digvijay1129/pragnyx-ca-firm-management |
| Branch | main |
| Frontend URL | Pending deployment |
| Backend API URL | Pending deployment |
| Health-check URL | Pending deployment |
| MongoDB database | Configure privately in Atlas |
| Admin test credential | Create privately; do not commit |
| Client test credential | Create during manual smoke testing |

