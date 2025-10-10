# COCO - Conversation Companion App

## Overview

COCO (Conversation Companion) is a real-time conversation assistant application that provides live transcription and contextual suggestions during conversations. The app uses browser-based speech recognition to transcribe conversations and offers intelligent suggestions to help users navigate their interactions more effectively. Inspired by Granola's clean transcription interface, COCO emphasizes a distraction-free, mobile-first design with glanceable information and progressive disclosure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (navigation between home, context setup, and active session pages)

**UI Component System**
- Shadcn/ui component library (New York style variant) providing a comprehensive set of Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom CSS variables for theming (light mode focused with HSL color definitions)
- Inter font family for consistent typography

**State Management**
- React Query (TanStack Query) for server state management and data fetching
- Local component state using React hooks (useState, useEffect, useRef)
- LocalStorage for persisting conversation context between sessions

**Key Features**
- **Speech Recognition**: Browser-native Web Speech API (webkitSpeechRecognition) for real-time transcription
- **Rive Animations**: Interactive character animations using @rive-app/react-canvas for visual feedback
- **Real-time Updates**: Live transcript display with auto-scrolling and speaker identification
- **Suggestion System**: Dynamic suggestion cards categorized by type (tip, response, warning, insight)

**Mobile-First Design Decisions**
- Touch-optimized UI with large tap targets (minimum 44px height for buttons)
- Responsive breakpoints using Tailwind's default system (768px mobile breakpoint)
- Fixed/sticky positioning for critical controls (session header)
- Viewport meta tag prevents user scaling for consistent mobile experience

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript for type safety
- ESM module system (type: "module" in package.json)
- Custom middleware for request logging and JSON response capture

**Development vs Production**
- Development: Vite middleware integrated with Express for HMR
- Production: Static file serving from built dist/public directory
- Conditional Replit development plugins (cartographer, dev-banner) loaded only in development

**API Structure**
- Currently minimal backend implementation (placeholder routes in server/routes.ts)
- RESTful API pattern with /api prefix convention
- Designed for future expansion with conversation analysis and suggestion generation

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL (dialect: "postgresql")
- Neon Database serverless driver (@neondatabase/serverless) for connection pooling
- Schema-first approach with migrations stored in ./migrations directory

**Current Schema**
- Users table with UUID primary keys (gen_random_uuid())
- Username/password authentication schema (not yet implemented in routes)
- Zod validation schemas generated from Drizzle tables for runtime type safety

**Storage Abstraction**
- IStorage interface pattern for CRUD operations
- MemStorage in-memory implementation (current placeholder)
- Designed to be swapped with database-backed storage without changing application code

### Authentication and Authorization

**Planned Implementation** (not yet active)
- Session-based authentication using connect-pg-simple for PostgreSQL session store
- User model with username/password fields in schema
- Express session configuration ready (credentials: "include" in fetch requests)
- No authentication currently enforced on routes

### External Dependencies

**Third-Party UI Libraries**
- Radix UI primitives (20+ component packages) for accessible, unstyled components
- Rive for animated character interactions and visual feedback
- Lucide React for consistent iconography
- cmdk for command palette patterns

**Development Tools**
- TypeScript for type checking (noEmit mode, types checked separately from build)
- ESBuild for server-side bundling in production
- Drizzle Kit for database migrations and schema management
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Runtime Dependencies**
- date-fns for date formatting and manipulation
- class-variance-authority + clsx for conditional CSS class composition
- React Hook Form with Zod resolvers for form validation (configured but not extensively used yet)

**Replit-Specific Integrations**
- @replit/vite-plugin-runtime-error-modal for development error overlay
- @replit/vite-plugin-cartographer for code navigation
- @replit/vite-plugin-dev-banner for development environment indicators