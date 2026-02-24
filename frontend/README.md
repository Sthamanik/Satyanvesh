# Satyanvesh — Frontend

Modern React client for the Satyanvesh judiciary platform, built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS 4**.

---

## 🛠️ Tech Stack

| Layer              | Technology                                   |
| ------------------ | -------------------------------------------- |
| Framework          | React 19                                     |
| Build Tool         | Vite 7                                       |
| Language           | TypeScript                                   |
| Styling            | Tailwind CSS 4 + tw-animate-css              |
| UI Components      | Shadcn UI (Radix UI primitives)              |
| Animations         | Framer Motion                                |
| Routing            | React Router DOM v7                          |
| Server State       | TanStack Query (React Query) v5              |
| Client State       | Zustand                                      |
| Forms              | React Hook Form + Zod resolvers              |
| Charts             | Recharts                                     |
| HTTP Client        | Axios (with interceptors)                    |
| Icons              | Lucide React                                 |
| Notifications      | React Hot Toast                              |
| Date Utilities     | date-fns                                     |

---

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component & providers
│   ├── App.css                 # Global styles
│   ├── index.css               # Tailwind directives & theme
│   ├── api/                    # Axios API modules
│   │   ├── advocates.api.ts
│   │   ├── auth.api.ts
│   │   ├── caseBookmarks.api.ts
│   │   ├── caseParties.api.ts
│   │   ├── caseTypes.api.ts
│   │   ├── caseViews.api.ts
│   │   ├── cases.api.ts
│   │   ├── courts.api.ts
│   │   ├── documents.api.ts
│   │   ├── hearings.api.ts
│   │   ├── notification.api.ts
│   │   └── users.api.ts
│   ├── hooks/                  # Custom React hooks (TanStack Query wrappers)
│   │   ├── useAdvocates.ts
│   │   ├── useAuth.ts
│   │   ├── useCaseBookmarks.ts
│   │   ├── useCaseParties.ts
│   │   ├── useCaseTypes.ts
│   │   ├── useCases.ts
│   │   ├── useCourts.ts
│   │   ├── useDocument.ts
│   │   ├── useHearings.ts
│   │   ├── useNotifications.ts
│   │   └── useUsers.ts
│   ├── components/
│   │   ├── ui/                 # 24 Shadcn UI primitives
│   │   ├── layouts/            # AppLayout, Sidebar, Header
│   │   ├── auth/               # Login & Register forms
│   │   ├── shared/             # Reusable components
│   │   ├── advocates/
│   │   ├── caseTypes/
│   │   ├── courts/
│   │   ├── documents/
│   │   ├── hearings/
│   │   └── notifications/
│   ├── pages/
│   │   ├── HomePage.tsx        # Landing / public home
│   │   ├── auth/               # Login, Register
│   │   ├── dashboard/          # Role-based dashboard
│   │   ├── cases/              # Case list, detail, create, edit, my-cases
│   │   ├── hearings/           # Hearing list & calendar
│   │   ├── documents/          # Document management
│   │   ├── courts/             # Court directory
│   │   ├── advocate/           # Advocate profiles
│   │   ├── caseTypes/          # Case type management
│   │   ├── caseParties/        # Party management
│   │   ├── bookmarks/          # Saved cases
│   │   ├── analytics/          # Charts & statistics
│   │   ├── admin/              # Admin panel
│   │   ├── profile/            # User profile
│   │   ├── settings/           # App settings
│   │   └── public/             # Public-facing pages
│   ├── routes/
│   │   ├── index.tsx           # Route definitions & guards
│   │   └── stores/             # Route-level state
│   ├── lib/
│   │   ├── axios.ts            # Axios instance + interceptors
│   │   ├── react-query.ts      # QueryClient configuration
│   │   ├── utils.ts            # Helper functions (cn, formatters)
│   │   └── validations/        # Zod form validation schemas
│   ├── types/                  # Shared TypeScript interfaces
│   └── assets/                 # Images & static media
├── index.html                  # HTML entry point
├── components.json             # Shadcn UI configuration
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- Backend server running (see [backend README](../backend/README.md))

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Start development server

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

### 4. Build for production

```bash
npm run build      # Type-check & bundle to dist/
npm run preview    # Preview the production build locally
```

---

## 🧪 Available Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR               |
| `npm run build`     | Type-check (`tsc`) & production build        |
| `npm run preview`   | Serve production build locally               |
| `npm run lint`      | Run ESLint across the project                |

---

## 🏗️ Architecture

```
                    ┌────────────────────────────────┐
                    │           App.tsx              │
                    │   (QueryClient, Router, Toast) │
                    └──────────────┬─────────────────┘
                                   │
                    ┌──────────────▼─────────────────┐
                    │         Routes (index.tsx)     │
                    │   Auth guards & role-based     │
                    └──────────────┬─────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
     ┌────────▼──────┐  ┌─────────▼───────┐  ┌────────▼──────┐
     │    Pages      │  │   Components    │  │    Layouts    │
     │  (views)      │  │  (reusable UI)  │  │  (shell)      │
     └────────┬──────┘  └─────────────────┘  └───────────────┘
              │
     ┌────────▼──────┐
     │    Hooks      │  ← TanStack Query mutations & queries
     └────────┬──────┘
              │
     ┌────────▼──────┐
     │   API Layer    │  ← Axios modules (one per resource)
     └────────┬──────┘
              │
     ┌────────▼──────┐
     │  Axios Client  │  ← Interceptors (auth, refresh, errors)
     └────────┬──────┘
              │
              ▼
        Backend API
```

### Key Patterns

- **API Layer** → One file per resource (`cases.api.ts`, `auth.api.ts`, etc.) wrapping Axios calls
- **Hooks** → TanStack Query hooks encapsulate all server-state fetching, caching, and mutations
- **Zustand** → Lightweight client-side state for auth session and UI preferences
- **Shadcn UI** → 24 pre-built, accessible UI primitives (Dialog, Select, Tabs, etc.)
- **Form Validation** → React Hook Form + Zod schemas for type-safe client-side validation
- **Route Guards** → Role-based access (Admin, Judge, Advocate, Litigant) at the router level

---

## 📄 Pages Overview

| Page            | Route                | Description                               |
| --------------- | -------------------- | ----------------------------------------- |
| Home            | `/`                  | Public landing page                       |
| Login           | `/login`             | User authentication                       |
| Register        | `/register`          | New user registration                     |
| Dashboard       | `/dashboard`         | Role-based overview & statistics          |
| Cases           | `/cases`             | Browse, search & filter all cases         |
| Case Detail     | `/cases/:id`         | Full case information & timeline          |
| My Cases        | `/my-cases`          | Cases assigned to the logged-in user      |
| Hearings        | `/hearings`          | Hearing schedule & calendar view          |
| Documents       | `/documents`         | Upload & manage legal documents           |
| Courts          | `/courts`            | Court directory                           |
| Advocates       | `/advocates`         | Lawyer profiles                           |
| Bookmarks       | `/bookmarks`         | Saved/bookmarked cases                    |
| Analytics       | `/analytics`         | Charts & statistics (Recharts)            |
| Admin           | `/admin`             | Admin user management panel               |
| Profile         | `/profile`           | User profile & avatar                     |
| Settings        | `/settings`          | Application preferences                   |

---

## 🛡️ License

ISC
