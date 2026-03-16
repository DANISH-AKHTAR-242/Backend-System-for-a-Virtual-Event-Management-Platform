# Virtual Event Management Platform - Backend

Production-ready REST API for managing virtual events, registrations, and authentication. Built with Express and MongoDB, structured with controllers, services, and middleware layers.

## 1) Problems previously identified
- Inconsistent layering (unused in-memory services, logic in controllers).
- Missing request validation and weak error handling.
- Authentication middleware accepted non-Bearer tokens; no 404 handler.
- No environment contract, Docker assets, or automated tests.
- Logging not integrated with error flow.

## 2) Current architecture
- **Framework:** Express 5 (CommonJS)
- **Database:** MongoDB via Mongoose models (`User`, `Event`)
- **Layers:**
  - **Routes** → **Controllers** → **Services** → **Models**
  - **Middleware:** auth, role-based access, rate limiting, error/not-found, security headers, async handler
  - **Utilities:** structured logger, HttpError class, payload validators
- **Config:** Centralized in `src/config/config.js` with env validation and defaults for local/test.

## 3) Suggested/implemented architecture improvements
- Thin controllers delegating to services with consistent HttpError usage.
- Input validation for auth and event flows (email format, password length, ObjectId checks, date validation).
- Unified error logging and consistent JSON error responses; 404 fallback.
- Security headers, rate limiting, bearer token enforcement, and role checks.
- Dockerfile + docker-compose for local dev with Mongo.
- Example env file and project structure documented.

## 4) Getting started
### Prerequisites
- Node.js 20+
- MongoDB running locally or via Docker Compose

### Environment
Copy the sample and adjust values:
```bash
cp .env.example .env
```

### Install & run
```bash
npm install
npm run dev   # nodemon (requires nodemon globally) or
npm start     # node src/server.js
```

### Docker (recommended for local dev)
```bash
export JWT_SECRET=your-secure-secret
docker compose up --build
```
API available at `http://localhost:3000`.

### Tests
Lightweight validation tests (Node test runner):
```bash
npm test
```

## 5) API (REST)
- `POST /api/auth/register` – create user (`name`, `email`, `password`>=8, `role` optional `organizer|attendee`)
- `POST /api/auth/login` – returns JWT + user
- `GET /api/events` – list events
- `POST /api/events` – create event (organizers only; Bearer token)
- `POST /api/events/:eventId/register` – register attendee for event

Responses are JSON with appropriate HTTP status codes. Errors include `message` and stack trace in development.

## 6) Security & validation highlights
- Bearer token enforcement with JWT verification.
- Role-based authorization middleware.
- Rate limiting (100 requests / 15 minutes).
- Basic security headers and disabled `x-powered-by`.
- Strict input validation for auth and event payloads plus ObjectId checks.

## 7) Project structure
```
src/
  app.js              # Express app wiring
  server.js           # Bootstrap + DB connection
  config/             # Env + Mongo config
  controllers/        # HTTP handlers
  services/           # Business logic
  models/             # Mongoose schemas
  middleware/         # Auth, roles, errors, etc.
  utils/              # Logger, HttpError
  validators/         # Request validation helpers
```

## 8) Files added for production readiness
- `.env.example` – required environment variables
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- `tests/validators.test.js` – sanity checks for validators

## 9) Roadmap ideas
- Add OpenAPI/Swagger docs
- Introduce request/response schemas with Zod/celebrate
- Add integration tests with mongodb-memory-server
- CI workflow to run tests and lint on push
