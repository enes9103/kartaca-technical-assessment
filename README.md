# Kartaca Frontend Technical Assessment

A simple employee social directory app built with **Next.js App Router**, **TypeScript**, **Redux Toolkit**, and **Redux-Saga**.

The project implements:
- Authentication flow (login/logout/session)
- SSR user listing with search/filter/sort/pagination
- Protected user detail page with user posts

## Live Demo

https://kartaca-technical-assessment-1s265dzcf-enes9103s-projects.vercel.app/users

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Redux Toolkit
- Redux-Saga
- Tailwind CSS

## Features

### 1) Authentication
- Login with `username/password` via DummyJSON auth API
- Auth state managed in Redux store
- `accessToken` and `refreshToken` stored in **HTTP-only cookies** through internal API routes
- Session bootstrap on app load (`/api/auth/me`)
- Logout flow via Redux-Saga + API route

### 2) Users Page (`/users`)
- Default landing page (`/` redirects to `/users`)
- Server-side rendered user data
- Search, filter, sort, pagination integration
- Non-auth users:
  - Can only paginate
  - Cannot use search/filter/sort
  - See limited card fields only
- Auth users:
  - Full card fields (username, email, city, job title, etc.)
  - Card click navigates to detail page

### 3) User Detail Page (`/users/[id]`)
- Protected route (redirects to `/login` if not authenticated)
- User profile card + user posts
- Post pagination
- Empty state when user has no posts

## Project Structure

```text
app/
  api/auth/
    login/route.ts
    logout/route.ts
    me/route.ts
  login/page.tsx
  users/
    layout.tsx
    page.tsx
    [id]/page.tsx

components/
  auth/
  layout/
  providers/
  users/
  user-detail/

lib/
  features/
    auth/
    app/
  helpers/
  sagas/
  store/
  utils/
```

## Routes

- `/` → redirects to `/users`
- `/login` → login page
- `/users` → main users directory page
- `/users/[id]` → protected user detail page

## SSR / CSR Approach

- **SSR (Server Components)**:
  - `app/users/page.tsx`
  - `app/users/[id]/page.tsx`
  - Data fetching and page rendering happen on server
- **CSR (Client Components)**:
  - Interactive UI parts (filters, buttons, form interactions, Redux hooks)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Demo Credentials

Use DummyJSON demo credentials:

- Username: `emilys`
- Password: `emilyspass`

## API References

- Auth Login: `https://dummyjson.com/auth/login`
- Auth Me: `https://dummyjson.com/auth/me`
- Users: `https://dummyjson.com/users`
- User Posts: `https://dummyjson.com/users/{id}/posts`

## Current Notes

- The app uses internal auth API routes to keep tokens in HTTP-only cookies for SSR compatibility.
- Lint is configured and passing.
- Jest/RTL tests and Docker setup are not added yet (planned next step).
