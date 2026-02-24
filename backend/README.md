# Satyanvesh — Backend

REST API server for the Satyanvesh judiciary platform, built with **Express.js 5**, **TypeScript**, and **MongoDB**.

---

## 🛠️ Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Runtime         | Node.js (v18+)                                |
| Framework       | Express.js 5                                  |
| Language        | TypeScript                                    |
| Database        | MongoDB + Mongoose ODM                        |
| Authentication  | JWT (Access + Refresh tokens, cookie-based)   |
| File Storage    | Multer → Cloudinary                           |
| Email           | Nodemailer (SMTP)                             |
| Validation      | Zod                                           |
| Logging         | Winston + Daily Rotate File                   |
| Security        | Bcryptjs, CORS, Express Rate Limiter          |
| Scheduler       | Node-Cron                                     |
| Build           | tsup (ESM output)                             |
| Dev Runner      | tsx (watch mode)                               |

---

## 📁 Project Structure

```
backend/
├── scripts/
│   └── seed.ts                 # Database seeding script
├── src/
│   ├── app.ts                  # Express app setup & middleware
│   ├── server.ts               # Server entry point
│   ├── config/
│   │   ├── cloudinary.config.ts
│   │   └── db/                 # MongoDB connection
│   ├── controllers/            # Request handlers
│   │   ├── advocate.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── case.controller.ts
│   │   ├── caseBookmark.controller.ts
│   │   ├── caseParty.controller.ts
│   │   ├── caseType.controller.ts
│   │   ├── caseView.controller.ts
│   │   ├── court.controller.ts
│   │   ├── document.controller.ts
│   │   ├── hearing.controller.ts
│   │   ├── notification.controller.ts
│   │   └── user.controller.ts
│   ├── models/                 # Mongoose schemas & models
│   │   ├── advocate.model.ts
│   │   ├── case.model.ts
│   │   ├── caseBookmark.model.ts
│   │   ├── caseParty.model.ts
│   │   ├── caseType.model.ts
│   │   ├── caseView.model.ts
│   │   ├── court.model.ts
│   │   ├── document.model.ts
│   │   ├── hearing.model.ts
│   │   ├── notification.model.ts
│   │   └── user.model.ts
│   ├── routes/                 # API endpoint definitions
│   │   ├── advocate.route.ts
│   │   ├── auth.route.ts
│   │   ├── case.routes.ts
│   │   ├── caseBookmark.route.ts
│   │   ├── caseParty.route.ts
│   │   ├── caseType.route.ts
│   │   ├── caseView.route.ts
│   │   ├── court.route.ts
│   │   ├── document.route.ts
│   │   ├── hearing.route.ts
│   │   ├── notification.route.ts
│   │   └── user.route.ts
│   ├── services/               # Business logic layer
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # JWT verification & role guard
│   │   ├── avatarUpload.middleware.ts  # Profile image upload
│   │   ├── errorHandler.middleware.ts  # Global error handler
│   │   ├── rateLimiter.middleware.ts   # API rate limiting
│   │   ├── upload.middleware.ts        # Document upload (Multer)
│   │   └── validate.middleware.ts      # Zod schema validation
│   ├── validations/            # Zod validation schemas
│   ├── utils/
│   │   ├── apiError.util.ts        # Custom API error class
│   │   ├── apiResponse.util.ts     # Standardised response wrapper
│   │   ├── asyncHandler.util.ts    # Async route error catcher
│   │   ├── cloudinary.util.ts      # Upload/delete helpers
│   │   ├── email.util.ts           # Email sender
│   │   ├── emailTemplates.util.ts  # HTML email templates
│   │   ├── jwt.util.ts             # Token generation/verification
│   │   └── logger.util.ts          # Winston logger configuration
│   └── types/                  # TypeScript type definitions
├── .env.example                # Environment variable template
├── tsconfig.json
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account (for document & avatar uploads)
- SMTP credentials (for email notifications)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable                 | Description                      |
| ------------------------ | -------------------------------- |
| `PORT`                   | Server port (default `8000`)     |
| `NODE_ENV`               | `development` or `production`    |
| `MONGODB_URI`            | MongoDB connection string        |
| `ACCESS_TOKEN_SECRET`    | Secret for signing access JWTs   |
| `ACCESS_TOKEN_EXPIRY`    | Access token lifetime (e.g. `1d`)|
| `REFRESH_TOKEN_SECRET`   | Secret for signing refresh JWTs  |
| `REFRESH_TOKEN_EXPIRY`   | Refresh token lifetime           |
| `CLOUDINARY_CLOUD_NAME`  | Your Cloudinary cloud name       |
| `CLOUDINARY_API_KEY`     | Cloudinary API key               |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret            |
| `EMAIL_HOST`             | SMTP host address                |
| `EMAIL_PORT`             | SMTP port                        |
| `EMAIL_SECURE`           | `true` / `false`                 |
| `EMAIL_USER`             | SMTP username / email            |
| `EMAIL_PASSWORD`         | SMTP password / app password     |
| `EMAIL_FROM_NAME`        | Sender display name              |
| `EMAIL_FROM_ADDRESS`     | Sender email address             |

### 3. Seed the database (optional)

```bash
npm run seed
```

### 4. Run in development

```bash
npm run dev
```

The server starts at `http://localhost:8000` with hot-reload via `tsx watch`.

### 5. Build for production

```bash
npm run build     # Outputs ESM bundle to dist/
npm run start     # Runs dist/server.mjs via nodemon
```

---

## 📡 API Overview

All endpoints are prefixed with `/api/v1`. Authentication is handled via HTTP-only cookies (access + refresh tokens).

| Module          | Base Route                    | Description                          |
| --------------- | ----------------------------- | ------------------------------------ |
| Auth            | `/api/v1/auth`                | Register, login, logout, refresh     |
| Users           | `/api/v1/users`               | User profile & management            |
| Cases           | `/api/v1/cases`               | CRUD for legal cases                 |
| Case Types      | `/api/v1/case-types`          | Manage case categories               |
| Case Parties    | `/api/v1/case-parties`        | Plaintiffs, defendants, witnesses    |
| Case Bookmarks  | `/api/v1/case-bookmarks`      | Bookmark/save cases                  |
| Case Views      | `/api/v1/case-views`          | Track case view history              |
| Courts          | `/api/v1/courts`              | Court records & jurisdictions        |
| Advocates       | `/api/v1/advocates`           | Lawyer profiles & assignments        |
| Hearings        | `/api/v1/hearings`            | Schedule & manage court hearings     |
| Documents       | `/api/v1/documents`           | Upload & manage legal documents      |
| Notifications   | `/api/v1/notifications`       | In-app notification system           |

---

## 🧪 Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start dev server with hot-reload (`tsx watch`)  |
| `npm run build`  | Compile TypeScript → ESM bundle via `tsup`      |
| `npm run start`  | Run production build with `nodemon`             |
| `npm run seed`   | Seed the database with sample data              |

---

## 🏗️ Architecture

```
Request → Route → Validation Middleware → Auth Middleware → Controller → Service → Model → MongoDB
                                                                ↓
                                                         API Response
```

- **Routes** – define endpoints and chain middlewares
- **Validation** – Zod schemas enforce request shape
- **Auth** – JWT middleware protects routes; role-based access control
- **Controllers** – thin layer that delegates to services
- **Services** – business logic, database queries, side-effects
- **Models** – Mongoose schemas with plugins (e.g. slug-updater)
- **Utils** – shared helpers (error handling, Cloudinary, email, logging)

---

## 🛡️ License

ISC
