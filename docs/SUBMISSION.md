# PragnyX — Assignment Submission Details

This file collects the final project links and evidence for the PragnyX MERN Stack Full Stack Developer technical assignment.

## Live application

- **Frontend:** https://pragnyx-ca-firm.vercel.app
- **Backend API base:** https://pragnyx-backend.onrender.com
- **Backend health check:** https://pragnyx-backend.onrender.com/health
- **Services API:** https://pragnyx-backend.onrender.com/api/services

The frontend uses the Render API through the `VITE_API_BASE_URL` production build variable. The deployed health endpoint and services endpoint were checked after deployment; the services endpoint returned all eight active catalogue entries.

## Source code and documentation

- **GitHub repository:** https://github.com/digvijay1129/pragnyx-ca-firm-management
- **Setup and feature guide:** [README.md](../README.md)
- **Database schema and API architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **PDF-to-implementation checklist:** [ASSIGNMENT-CHECKLIST.md](ASSIGNMENT-CHECKLIST.md)

## Database schema summary

The application uses MongoDB with Mongoose and these five collections:

| Collection | Purpose |
|---|---|
| `User` | Client/admin accounts; unique email, bcrypt-hashed password, role and active state |
| `Service` | CA service catalogue; unique slug, descriptions, icon and active/archive state |
| `Inquiry` | Contact messages; optional user reference so public visitors can submit |
| `Booking` | Consultation requests with client, service, preferred date/time, status and admin note |
| `ServiceRequest` | Authenticated client requests with service, details, status and admin note |

Public registration creates client-role accounts only. Administrator accounts are provisioned through the server seed script. Booking and service-request records preserve the selected service name as a snapshot.

## Automated verification

Successful GitHub Actions verification for the submission package:

- **Latest submission-document workflow:** https://github.com/digvijay1129/pragnyx-ca-firm-management/actions/runs/45453154817 (run #111; commit `31eded1d621f0111cc6be46eabb0282d853ea425`; all three jobs passed).
- **Application verification workflow:** https://github.com/digvijay1129/pragnyx-ca-firm-management/actions/runs/45446280553 (run #110; commit `6b9217582febacc085972470d5b1b1d0f7417d26`; all three jobs passed).
- Frontend production build: passed
- Backend JavaScript syntax check: passed
- Backend API integration tests: 12 passed, 0 failed
- Postman/Newman: 26 requests and 34 assertions, 0 failures
- Playwright: 2 browser scenarios passed

The successful CI runs store downloadable artifacts named `pragnyx-browser-e2e-report` and `pragnyx-postman-report`. The browser artifact includes screenshots of Home, About, Services on mobile, Service Details, Contact, Client Dashboard, Admin Dashboard, and client status after administrator updates.

## Test accounts and credential handoff

- **Administrator account:** use the administrator account provisioned in the deployed database. Provide its actual login email and password to the evaluator through the submission portal or another private channel.
- **Client account:** register a dedicated test client on the live website and provide its actual login email and password through the same private channel.

Do not commit passwords, JWTs, MongoDB connection strings, or other secrets to GitHub. Do not place production secrets in public screenshots or a publicly accessible document.

## Demo content notice

PragnyX is a fictional assignment/demo brand. Sample email, phone, location, hours, social destinations and testimonials are not real business details. Contact and booking submissions are stored in the configured database; no email notification provider is configured. Payment gateway integration is not included because it is not required by the assignment.

## Final handoff checklist

- [x] Working frontend URL
- [x] Working backend API URL and health endpoint
- [x] GitHub source repository
- [x] README setup instructions
- [x] Database schema explanation
- [x] Automated test evidence and browser screenshots
- [ ] Confirm one dedicated client test login and share its credentials privately
- [ ] Share admin and client test credentials privately with the evaluator
- [ ] Attach the screenshots/evidence pack to the submission
