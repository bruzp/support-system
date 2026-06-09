# Support System

A full-stack issue ticketing system built with Laravel and Next.js. Designed for support teams to manage, track, and escalate issues - with role-based access control separating what admins and regular users can see.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| API      | Laravel 13, Sanctum, PostgreSQL         |
| Frontend (Next.js) | Next.js 16, Mantine UI, TanStack Query, Zustand  |
| Frontend (Nuxt.js) | Nuxt 4, Nuxt UI v4, Pinia  |
| AI       | Ollama (qwen2.5:0.5b) for issue summaries |
| Infra    | Docker, Docker Compose                  |

---

## Architecture

### API - Laravel 13

Laravel was chosen because it lets you focus on solving the actual problem rather than spending time wiring up a framework from scratch. It ships with everything you need out of the box, so the focus stays on business logic.

The API follows a **DTO → Service → Repository** pattern:

- **Repository** handles all database queries - nothing else touches Eloquent directly
- **Service** contains the business logic and orchestrates calls to the repository
- **DTO (Data Transfer Object)** carries validated, typed data between layers so each layer only receives exactly what it needs

This keeps each layer focused on one responsibility and makes the codebase straightforward to extend or debug.

A few other decisions worth noting:

- **Enums** are used for `status`, `priority`, and `category` fields - no magic strings scattered across the codebase, and adding a new value means changing it in one place
- **Laravel Sanctum** handles API token authentication
- **Policy-based authorization** controls what each role can access - admins see all issues across the system, while regular users only see issues they created

### Frontend - Next.js 16

The frontend consumes the Laravel API and is built around a few focused choices:

- **TanStack Query** manages all server state - handles caching, background refetching, and loading/error states so components stay clean
- **Axios** with request/response interceptors handles token injection and global 401 handling in one place, rather than in every individual hook
- **Reusable hooks** (`useIssues`, `useAuth`, `useUsers`) abstract all API calls so pages only deal with data, not HTTP logic
- **Zustand** manages shared client-side filter state
- **Mantine UI** provides the component library - forms, tables, modals, and notifications
- **Next.js Middleware** protects dashboard routes server-side before any page renders, and redirects logged-in users away from the login page

### Frontend - Nuxt 4

An alternative frontend built with Nuxt 4 that implements the same feature set, demonstrating how the same Laravel API can be consumed across different frontend frameworks.

- **$fetch** for SSR-aware HTTP requests, with Nuxt UI v4 as the component library
- **useAsyncData** manages server state and data fetching
- **Global route middleware** handles auth protection and redirects across all pages
- **Pinia** manages shared client-side filter state

### Database - PostgreSQL

PostgreSQL over MySQL for a few reasons: better handling of concurrent writes, stronger data integrity constraints, and it scales well as the dataset grows. A solid choice for anything that needs to hold up in production.

---

## Design Principles

Three principles guided every decision in this project:

**Reusability** - hooks, form components, and API utilities are written once and shared. Adding a new resource means following the same pattern, not reinventing it.

**Extensibility** - the layered architecture on the API side and the hook-based pattern on the frontend mean new features slot in without touching unrelated code.

**Maintainability** - each file has a clear, single purpose. A developer picking this up for the first time should be able to trace a request from the UI all the way to the database without getting lost.

---

## What I'd Improve Next

These are the things I'd prioritize given more time:

1. **API testing with PEST** - unit tests for services and feature tests for all API endpoints
2. **Laravel Queues** - offload API-heavy processing (like AI summarization) to background jobs so requests stay fast
3. **Scheduled escalation** - run escalation checks on a queue schedule rather than inline
4. **Frontend testing** - component and integration tests with Jest and Testing Library
5. **GitHub Actions CI** - automated lint and test runs on every push and pull request for both the API and frontend

---

## Setup

See [SETUP.md](./SETUP.md) for the full step-by-step guide to get the project running locally with Docker.