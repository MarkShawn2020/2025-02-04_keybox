# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KeyBox is an environment variable management system built as a monorepo. The web package is a Next.js 14 application using App Router, TypeScript, Supabase for backend, and shadcn/ui for components.

## Commands

### Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **State Management**: Jotai atoms + TanStack React Query
- **UI Components**: shadcn/ui (Radix UI + TailwindCSS)
- **Forms**: React Hook Form + Zod validation

### Key Directories
- `app/`: Next.js App Router pages and API routes
  - `(auth-pages)/`: Authentication pages (login, signup, etc.)
  - `protected/`: Authenticated user pages
  - `api/`: API route handlers
- `components/`: React components organized by feature
  - `ui/`: shadcn/ui base components
  - `projects/`, `variables/`: Feature-specific components
- `utils/`: Server actions and utility functions
- `atoms/`: Jotai state atoms
- `hooks/`: Custom React hooks
- `lib/`: External library configurations (Supabase client)

### Component Patterns
- Use shadcn/ui components from `@/components/ui/`
- Server components by default, use "use client" when needed
- Form validation with Zod schemas
- Server actions in `utils/actions/` for data mutations

### State Management
- Client state: Jotai atoms in `atoms/` directory
- Server state: React Query with Supabase
- Form state: React Hook Form

### Authentication Flow
- Supabase Auth with middleware in `middleware.ts`
- Protected routes under `/protected/*`
- Session management handled server-side
- Auth utilities in `utils/supabase/`

### Database Schema
Main entities:
- `keys`: Environment variables
- `projects`/`solutions`: Variable groupings
- `platforms`: Deployment targets
- `key_groups`: Variable organization

### API Patterns
- Server actions for mutations (preferred over API routes)
- API routes in `app/api/` for external integrations
- Use Supabase client for database operations
- Row Level Security (RLS) policies handle authorization

### Styling Conventions
- TailwindCSS utility classes
- CSS variables for theming (defined in `app/globals.css`)
- Dark mode support via next-themes
- Responsive design with mobile-first approach

### Important Files
- `middleware.ts`: Auth session refresh
- `utils/supabase/client.ts`: Browser Supabase client
- `utils/supabase/server.ts`: Server Supabase client
- `components.json`: shadcn/ui configuration

## Development Guidelines

### When Adding New Features
1. Create server actions in `utils/actions/` for data operations
2. Use existing UI components from `components/ui/`
3. Add new feature components in relevant `components/` subdirectory
4. Create Jotai atoms for complex client state in `atoms/`
5. Follow existing patterns for forms (React Hook Form + Zod)

### Working with Supabase
- Always use server client for SSR pages
- Use browser client for client components
- Handle errors with proper user feedback via toast
- Respect RLS policies - don't bypass security

### Code Style
- TypeScript strict mode is enabled
- Use path aliases (`@/` for imports)
- Async/await over promises
- Early returns for error handling