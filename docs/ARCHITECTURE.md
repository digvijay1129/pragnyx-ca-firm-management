# Architecture Notes

This document records implementation decisions for the PragnyX CA Firm Management Website.

## Application areas

1. Public website: home, about, services, service details, and contact.
2. Authentication: registration, login, logout, profile, and role-aware access.
3. Client portal: profile, service requests, inquiry history, bookings, and booking status.
4. Admin portal: overview metrics, services, clients, inquiries, and consultation bookings.

## Initial data domains

- User
- Service
- Inquiry
- Booking
- ServiceRequest

The detailed Mongoose fields, indexes, validation rules, and API contracts will be recorded as those models and endpoints are implemented.

## Security principles

- Hash passwords with bcrypt; never store plaintext passwords.
- Sign and verify JWTs using environment-provided secrets.
- Enforce authorization on the server, not only in the React UI.
- Validate and normalize user input at API boundaries.
- Keep credentials in environment variables and out of version control.
