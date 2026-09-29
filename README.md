# Bifrost

**Role-based employee and task management system built with Next.js, Prisma and PostgreSQL.**

Admins create and assign tasks, employees accept them and move them through a strict lifecycle, and every action is checked on the server, not just hidden in the UI.

[Live Demo](https://bifrost.saqibhussnain.me) | [Report a Bug](https://github.com/Saqib216/bifrost/issues) | [Author](https://github.com/Saqib216)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

![Bifrost dashboard](./docs/dashboard.png)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Screenshots](#screenshots)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Security Model](#security-model)
7. [Database Design](#database-design)
8. [Routes](#routes)
9. [Server Actions](#server-actions)
10. [Project Structure](#project-structure)
11. [Getting Started](#getting-started)
12. [Environment Variables](#environment-variables)
13. [Demo Access](#demo-access)
14. [Deployment](#deployment)
15. [Challenges and Learnings](#challenges-and-learnings)
16. [Roadmap](#roadmap)
17. [Author](#author)
18. [License](#license)

---

## Overview

Bifrost is a full-stack task management app with two roles, Admin and Employee, each with its own dashboard, navigation and permissions.

An admin manages the team: creates tasks, assigns them to employees, edits or deletes them, and watches team performance on an analytics page. An employee sees only their own work, accepts new tasks, and marks them completed or failed.

I built it as a portfolio project and as a way to learn Next.js properly: the App Router, Server Components, Server Actions, route protection and database access, all in one real application. It started as a client-side React project and I rebuilt it from scratch on Next.js with a real database and real authentication.

---

## Features

### Admin

- Overview dashboard with completion rate, total employees and total tasks
- Tasks board with one tab per employee, plus an "All" tab that is paginated on the server (9 tasks per page)
- Create, edit and delete tasks, including changing a task's status from the edit form
- Optimistic delete with `useOptimistic`: the card disappears instantly and comes back if the server rejects the request
- Search by title and filter by status
- Employees page with search, and a detail page per employee with their own task filters
- Analytics page with area, bar and pie charts (Recharts)

### Employee

- Personal dashboard with a task performance summary
- Tasks page showing only their own tasks
- Accept a task (New to Active), then mark it Completed or Failed
- Profile page with avatar upload and removal, name change, and password change

### General

- Public signup that always creates an Employee account and assigns three onboarding tasks
- Four accent colours (magenta, blue, amber, violet). The choice is saved per user in the database and applied on the server, so there is no flash of the wrong colour on page load. Logged-out pages remember the last choice through a cookie
- Animated landing page
- Toast notifications for every action result
- Loading and error boundaries on the admin tasks route
- Responsive layout with a mobile header

---

## Screenshots

### Landing Page

![Landing Page](./docs/landing.png)

### Login

![Login](./docs/login.png)

### Admin Tasks Board

![Admin Tasks Board](./docs/tasks.png)

### Analytics

![Analytics](./docs/analytics.png)

### Employee Dashboard

![Employee Dashboard](./docs/employee.png)

### Profile Settings

![Profile Settings](./docs/profile.png)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Base UI |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 with the `@prisma/adapter-pg` driver adapter |
| Authentication | Auth.js v5 (Credentials provider, JWT sessions) with `@auth/prisma-adapter` |
| Validation | Zod |
| File storage | Vercel Blob |
| Charts | Recharts |
| Animation | Motion |
| Notifications | Sonner |
| Date picker | react-day-picker, date-fns |
| Icons | Font Awesome, Lucide |
| Fonts | Geist, Geist Mono, Space Grotesk via `next/font` |
| Package manager | pnpm |
| Hosting | Vercel |

---

## Architecture

Bifrost uses the Next.js App Router with a clear split between server and client code.

- **Server Components** fetch data directly from the database with Prisma. There is no `useEffect` data fetching and no separate REST API for the app's own data.
- **Client Components** only handle interactivity: modals, tabs, filters, optimistic updates, animations.
- **Server Actions** (`app/lib/actions.ts`) handle every mutation. Forms use `useActionState` so validation errors and pending states come back without any manual fetch code.
- **Pagination state lives in the URL** (`?tab=all&page=2`), so pages are shareable and survive a refresh. The server reads the params and queries with Prisma `skip` and `take`.
- **Route-specific components** live next to their route in `_components` folders.

### Request flow

```mermaid
flowchart LR
    A[Browser] --> B[proxy.ts]
    B -->|not logged in| C[/login]
    B -->|wrong role| D[Redirect to own dashboard]
    B -->|allowed| E[Server Component]
    E --> F[(PostgreSQL via Prisma)]
    A -->|form submit| G[Server Action]
    G --> H{Session and role check}
    H -->|fail| I[Unauthorized]
    H -->|pass| J[Zod validation]
    J --> F
    G --> K[revalidatePath]
```

### Task lifecycle

```mermaid
stateDiagram-v2
    [*] --> NEW
    NEW --> ACTIVE: Employee accepts
    ACTIVE --> COMPLETED: Employee completes
    ACTIVE --> FAILED: Employee marks failed
    COMPLETED --> [*]
    FAILED --> [*]
```

The allowed moves are defined once in `app/lib/taskTransitions.ts` and enforced in the database query itself (see below).

---

## Security Model

A hidden button is not security, so every rule is enforced on the server.

**Route protection.** `proxy.ts` reads the session before a page renders. Logged-out users are sent to `/login`, admins cannot open `/employee`, employees cannot open `/admin`, and a logged-in user who visits `/login` or `/` is redirected to their own dashboard.

**Server Actions check again.** Middleware alone is not enough because Server Actions can be called directly. Admin actions call `requireAdmin()`, and employee actions read the user id and role from the session, never from the client.

**Atomic status changes.** When an employee changes a task's status, the update runs as a single `updateMany` whose `where` clause contains the task id, the owner's user id, and the list of statuses the task is allowed to come from. If any condition fails, zero rows change. An employee cannot touch another person's task or skip a step, even by calling the action by hand.

**Role is never taken from the form.** Public signup hardcodes `EMPLOYEE` in the server action.

**Validation.** Every form is validated with Zod on the server, and field-level errors are returned to the UI. The status value from the client is also checked against the `TaskStatus` enum.

**Passwords.** Hashed with bcrypt. Changing a password requires the current one and rejects reusing it.

**Demo protection.** Seeded demo accounts are flagged with `isDemo` and cannot change their name or password, so one visitor cannot lock everyone else out of the demo.

**Uploads.** Avatars are limited to 4 MB and to JPG, PNG, WEBP or GIF, checked on both client and server. The old file is deleted from Vercel Blob when it is replaced or removed.

---

## Database Design

Two models, one relation. Roles, task status and accent colour are Postgres enums.

```mermaid
erDiagram
    USER ||--o{ TASK : "assigned to"
    USER {
        string id PK
        string name
        string email UK
        string password
        string image
        Role role
        AccentColor accentColor
        boolean isDemo
        datetime createdAt
    }
    TASK {
        string id PK
        string title
        string description
        string category
        TaskStatus status
        datetime taskDate
        string userId FK
        datetime createdAt
    }
```

| Enum | Values |
| --- | --- |
| Role | ADMIN, EMPLOYEE |
| TaskStatus | NEW, ACTIVE, COMPLETED, FAILED |
| AccentColor | MAGENTA, BLUE, AMBER, VIOLET |

The schema is in `prisma/schema.prisma` and every change has a migration in `prisma/migrations`.

---

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Sign in, with a "Try as Admin" demo button |
| `/signup` | Public | Create an employee account |
| `/admin` | Admin | Overview dashboard |
| `/admin/tasks` | Admin | Tasks board, per-employee tabs and paginated All view |
| `/admin/employees` | Admin | Employee grid with search |
| `/admin/employees/[id]` | Admin | One employee's tasks with filters |
| `/admin/analytics` | Admin | Charts |
| `/employee` | Employee | Dashboard and task performance |
| `/employee/tasks` | Employee | Own tasks with status actions |
| `/employee/profile` | Employee | Avatar, name and password |

---

## Server Actions

All actions live in `app/lib/actions.ts`.

| Action | Who can call it | What it does |
| --- | --- | --- |
| `authenticate` | Anyone | Signs in and redirects by role |
| `register` | Anyone | Creates an employee with three onboarding tasks |
| `createTask` | Admin | Validates and creates a task |
| `updateTask` | Admin | Edits a task, including its status |
| `deleteTask` | Admin | Deletes a task |
| `updateTaskStatus` | Employee | Moves own task to an allowed next status |
| `updateAvatar` | Logged in | Uploads a new avatar and deletes the old one |
| `removeAvatar` | Logged in | Removes the avatar |
| `updateProfileName` | Logged in, non-demo | Changes display name |
| `changePassword` | Logged in, non-demo | Verifies the current password and sets a new one |
| `updateAccentColor` | Logged in | Saves the accent choice to the database |

---

## Project Structure

```
bifrost/
├── app/
│   ├── _components/          Landing page sections
│   ├── admin/
│   │   ├── _components/      TasksBoard, TasksModal, StatusFilterSelect
│   │   ├── analytics/
│   │   ├── employees/
│   │   └── tasks/            page, loading, error
│   ├── employee/
│   │   ├── _components/      TaskStatusActions
│   │   ├── profile/          AvatarUpload, ProfileSettings
│   │   └── tasks/
│   ├── login/
│   ├── signup/
│   ├── lib/                  actions, prisma client, transitions, status styles
│   ├── api/auth/             Auth.js route handler
│   ├── globals.css           Design tokens and theme
│   └── layout.tsx
├── components/               Sidebar, Navlinks, AccentToggle, shadcn/ui
├── prisma/                   schema, migrations, seed
├── types/                    next-auth type augmentation
├── auth.ts                   Auth.js configuration
├── proxy.ts                  Role-based route protection
└── prisma.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js
- pnpm
- A PostgreSQL database (a free Neon database works)
- A Vercel Blob store, only if you want avatar upload to work locally

### Installation

```bash
git clone https://github.com/Saqib216/bifrost.git
cd bifrost
pnpm install
```

`pnpm install` also runs `prisma generate` through the `postinstall` script.

### Set up the environment

Create a `.env` file in the project root. Every variable is explained in the next section.

### Set up the database

```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

The seed script uses upserts, so running it twice will not create duplicates.

### Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Run pending migrations, then build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

---

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the app |
| `DIRECT_URL` | Optional | Direct (non-pooled) connection used by Prisma migrations. Falls back to `DATABASE_URL` |
| `AUTH_SECRET` | Yes | Secret used by Auth.js to sign sessions. Generate with `npx auth secret` |
| `BLOB_READ_WRITE_TOKEN` | For avatars | Vercel Blob token. Avatar upload is disabled without it |
| `REAL_ADMIN_EMAIL` | For seeding | Email of the real admin account created by the seed script |
| `REAL_ADMIN_PASSWORD` | For seeding | Password for that admin account |

Example:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"
AUTH_SECRET="your-generated-secret"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
REAL_ADMIN_EMAIL="you@example.com"
REAL_ADMIN_PASSWORD="a-strong-password"
```

Never commit `.env`. It is already listed in `.gitignore`.

---

## Demo Access

You can use the live demo without creating anything.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@ems.com` | `Admin@123` |

On the login page, the "Try as Admin" button fills these in for you. To see the employee side, sign up with any email: you get an employee account with three onboarding tasks ready to accept.

Demo accounts cannot change their name or password.

---

## Deployment

The app is deployed on Vercel with a Neon PostgreSQL database.

1. Push the repository to GitHub and import it in Vercel.
2. Add the environment variables from the table above in the Vercel project settings.
3. Connect a Vercel Blob store to the project for avatar uploads.
4. Deploy. The build script runs `prisma migrate deploy` before `next build`, so the database schema is always up to date with the code.
5. Run the seed once against the production database to create the demo data.

---

## Challenges and Learnings

**Where validation belongs.** Client checks are for a good user experience, server checks are for security. The status update is the clearest example: instead of reading the task and then updating it (which leaves a gap between the two steps), one `updateMany` query checks ownership and the allowed transition together.

**Choosing when to use `useOptimistic`.** Delete is where lag is most visible, because the card stays on screen while the server works, so it gets an optimistic update. The edit flow already has a modal with a pending state, so I left it alone.

**Pagination in the URL.** Client-side pagination is simpler, but it loads everything up front. Keeping `page` in the URL and using Prisma `skip` and `take` keeps the query small and the page shareable.

**Theming without a flash.** Storing the accent colour in the database and setting `data-accent` on `<html>` from the root layout means the correct colour is in the first HTML the server sends.

**Middleware and Server Actions are separate doors.** Route protection in `proxy.ts` does not protect a Server Action that someone calls directly, so each action checks the session itself.

**Deprecated and changing tooling.** This project runs on recent versions (Next.js 16, Prisma 7, Auth.js v5 beta), so a lot of older tutorials no longer applied. Reading the official docs was the only reliable way forward.

---

## Roadmap

- [x] Role-based dashboards and protected routes
- [x] Task CRUD with validation
- [x] Employee status flow with enforced transitions
- [x] Server-side pagination
- [x] Optimistic delete
- [x] Avatar upload with Vercel Blob
- [x] Profile settings and password change
- [x] Multiple accent colours
- [x] Public signup
- [ ] Light theme
- [ ] Pagination on the employee tasks page
- [ ] Automated tests
- [ ] Notifications when a task is assigned

---

## Author

**Muhammad Saqib Hussnain -**
BSCS student at the University of the Punjab

[GitHub](https://github.com/Saqib216) | [LinkedIn](https://linkedin.com/in/saqib-hussnain)

---

## License

Released under the MIT License. See [LICENSE](./LICENSE) for details.