# JitGibiGubae Backend

This repository contains the backend service for the JitGibiGubae project. The current implementation is a small Express + TypeScript + Prisma application with PostgreSQL connectivity, JWT utility helpers, localization support, and centralized error handling.

Important: the codebase is still in a minimal starter state. At the moment, the app registers only a root route and a health-check route; there are no feature-specific API modules or business endpoints implemented yet.

## Tech stack and key dependencies

- Node.js with TypeScript
- Express 5 for the HTTP server
- PostgreSQL database access via Prisma 7 and `pg`
- Prisma PostgreSQL adapter (`@prisma/adapter-pg`)
- JWT authentication utilities using `jsonwebtoken`
- i18next + `i18next-http-middleware` for English/Amharic localization
- CORS and JSON parsing support for web clients
- Validation and structured API helpers (`joi`, `ApiError`, `ApiResponse`)
- `dotenv` for environment configuration

Core project scripts from `package.json`:

- `npm run dev` — start the project in watch mode
- `npm run build` — compile TypeScript
- `npm run start` — run the production build
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — create and apply Prisma migrations
- `npm run db:reset` — reset database and reapply migrations
- `npm run db:studio` — open Prisma Studio
- `npm run lint` and `npm run check` — code quality checks

## Project structure

```bash
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── db.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── authorize.ts
│   │   ├── localizationMiddleware.ts
│   │   └── validatorMiddleware.ts
│   ├── locales/
│   │   ├── am.ts
│   │   ├── en.ts
│   │   ├── auth/
│   │   └── index.ts
│   ├── types/
│   ├── utils/
│   └── generated/prisma/
├── dev/
│   └── script/
├── .env.example
├── .gitignore
├── eslint.config.ts
├── package.json
├── prisma7.config.ts
├── tsconfig.json
└── README.md
```

## Installation and setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file from the example:

```bash
cp .env.example .env
```

3. Update the values in `.env` to match your local setup.

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Start the app in development mode:

```bash
npm run dev
```

## Environment variables (.env.example)

The project currently expects the following environment variables based on the code in `src/config/db.ts`, `src/utils/jwtToken.ts`, and `src/app.ts`:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL_CORS=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jitgibigubae?schema=public"
DATABASE_CONNECTION_LIMIT=10

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1h
JWT_ISSUER=local-dev
JWT_AUDIENCE=backend

JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Optional compatibility aliases used by the project
ACCESS_TOKEN_SECRET=your-super-secret-key
```

Notes:

- `DATABASE_URL` is required for Prisma and PostgreSQL connection.
- `JWT_SECRET` is used for token verification; `ACCESS_TOKEN_SECRET` is supported as a fallback alias.
- `FRONTEND_URL_CORS` is used to configure CORS origins.
- `PORT` defaults to `3000` when not set.

## Database setup and Prisma migrations

The Prisma schema currently defines a single model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

To set up the database:

```bash
npx prisma migrate dev --name init
```

If you want to inspect the database visually:

```bash
npm run db:studio
```

If the Prisma client is out of date after schema changes, run:

```bash
npm run db:generate
```

## How to run the project

### Development

```bash
npm run dev
```

This starts the app with `tsx watch` and watches for file changes.

### Production

1. Build the app:

```bash
npm run build
```

2. Start the built server:

```bash
npm run start
```

The server listens on `PORT` (default: `3000`).

## Available API endpoints

At the moment, the app exposes only the following routes from `src/app.ts`:

| Method          | Route     | Description                                                                                 |
| --------------- | --------- | ------------------------------------------------------------------------------------------- |
| GET             | `/`       | Returns a simple JSON payload containing the active language and translated user name text. |
| GET             | `/health` | Health check endpoint that returns `{ "status": "ok" }`.                                    |
| Any other route | `*`       | Handled by the global `notFoundHandler`, which returns a localized 404 error.               |

No feature APIs such as auth, user management, or business controllers are currently registered in the app.

## Authentication and authorization overview

The project includes JWT-based auth infrastructure, but it is not connected to any public route in the current app.

What exists in the code:

- `src/utils/jwtToken.ts` creates and verifies access tokens.
- `src/utils/token.ts` extracts a token from:
  - `Authorization: Bearer <token>`
  - `req.cookies.token`
  - `x-access-token` header
- `src/middleware/authMiddleware.ts` verifies the token, loads the user from Prisma, and attaches it to `req.user`.
- `src/middleware/authorize.ts` checks that a user has a required role before continuing.

Authenticated users are expected to have the following fields:

```ts
{
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  role?: string;
}
```

The current app does not register any protected routes, so authentication is ready for future endpoints but not yet exposed to clients.

## Error handling and response format

The project uses centralized error handling in `src/utils/errorHandler.ts`.

### Error response format

When an error occurs, the API returns a JSON body shaped like this:

```json
{
  "success": false,
  "message": "Localized error message",
  "errors": []
}
```

This is produced by `errorHandler` and uses the `ApiError` class. It also supports localized messages using `req.t(...)` with English and Amharic resources.

### Success response helper

There is a reusable `ApiResponse` helper in `src/utils/apiResponse.ts`:

```ts
new ApiResponse(statusCode, data, message);
```

It includes:

- `statusCode`
- `data`
- `message`
- `success`

This helper exists in the project, but the current app routes do not yet use it for their responses.

## Notes for contributors

- The backend is intentionally lightweight and can be expanded by adding route modules, controllers, and domain services.
- Localization is already configured for `en` and `am`.
- Prisma is connected at startup from `src/server.ts` and `src/config/db.ts`.
- The current app is a good starting point for building more API features on top of the existing architecture.

---

This README reflects only the implementation that is currently present in the codebase.
