# Frontend architecture

The React application is organised by business capability.

- `app/App.jsx` composes all application routes.
- `features/` contains code owned by a single business area: public website, authentication, consultation booking, client self-service and admin operations.
- `shared/` contains reusable cross-feature components and infrastructure: site layout, form primitives, notices, status indicators, route guards, API client and firm contact configuration.
- `data/` contains static reference data used as a fallback for the service catalogue.
- `e2e/` contains Playwright browser workflows.

## Route ownership

| Area | Assignment pages |
|---|---|
| Public | Home, About Us, Services, Service Details, Contact |
| Authentication | Login, Register |
| Booking | Consultation Booking |
| Client | Client Dashboard |
| Admin | Admin Dashboard |

## UI principles

The shared stylesheet defines the navy, brass and neutral palette, spacing, form fields, card surfaces, responsive breakpoints, visible keyboard focus and reduced-motion behavior. This keeps the public website, client portal and admin workspace visually consistent without coupling their business logic.

The reorganisation preserves the existing API contracts and route paths. The assignment's required workflows remain in their respective feature modules.
