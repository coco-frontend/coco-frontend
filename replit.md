# COCO - Conversation Companion App

## Overview

COCO (Conversation Companion) is a real-time conversation assistant application that provides AI-powered suggestions during live conversations. The app uses browser-based speech recognition to transcribe conversations in the background and leverages OpenAI's GPT-5 to generate contextual, actionable suggestions. The design emphasizes a distraction-free, mobile-first interface with ChatGPT-style expandable pills for context entry and Rive animations for visual feedback.

## Recent Updates (October 10, 2025)

### ✅ Completed Features
1. **Rive Animation Integration**: Replaced static microphone icon with animated Rive character that responds to user actions (Loading trigger on load, voice starts on session start)
2. **Expandable Context Pills**: Redesigned context form with ChatGPT-style pill buttons that expand to show input fields with proper cancel/save behavior
3. **OpenAI Backend Integration**: Implemented GPT-5 powered suggestion generation with graceful error handling for missing API keys
4. **Complete End-to-End Flow**: Fully functional conversation flow from context setup → recording → AI suggestions → session end

### 🔧 Technical Implementation
- Web Speech API for browser-native audio transcription
- localStorage for context persistence and rehydration
- POST /api/suggestions endpoint for AI suggestion generation
- Responsive error handling with toast notifications
- Mobile-optimized touch targets and rounded-full pill design

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (/ → home, /session → active conversation)

**UI Component System**
- Shadcn/ui component library (New York style variant) providing Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Rive animations (@rive-app/react-canvas) for interactive visual feedback
- Inter font family for consistent typography

**State Management**
- React Query (TanStack Query) for server state management (configured but minimal usage)
- Local component state using React hooks (useState, useEffect, useRef)
- LocalStorage for persisting conversation context between sessions

**Key Features**
- **Speech Recognition**: Browser-native Web Speech API (webkitSpeechRecognition) for real-time transcription
  - Continuous mode with interim results
  - Automatic restart on connection drop (using refs to avoid stale closures)
  - Proper error handling for permissions and browser compatibility
  
- **Rive Animations**: Interactive character animations for visual engagement
  - Loading trigger fires on page load
  - Voice starts trigger fires when starting a session
  - Located at /attached_assets/coco_1760095148906.riv
  
- **Context Management**: Expandable pill-based input system
  - Your Name, Event Details, Your Goals, Participants & Relationships
  - Local state staging for edits (only commits on Save, discards on Cancel)
  - Auto-save to localStorage, rehydrates on page load
  - Visual checkmarks indicate filled pills
  
- **AI Suggestions**: Real-time conversation guidance powered by OpenAI GPT-5
  - Contextual suggestions based on user profile and conversation transcript
  - Categorized by type (question, tip, response) and priority (high, normal)
  - Graceful degradation when API key is missing

**Mobile-First Design**
- Touch-optimized UI with 44px+ tap targets
- Rounded-full pill buttons for modern aesthetic
- Responsive breakpoints (768px mobile threshold)
- Fixed positioning for session controls
- Distraction-free suggestion panel (transcript hidden)

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript for type safety
- ESM module system (type: "module" in package.json)
- Vite middleware integration for development HMR

**API Routes**
- `POST /api/suggestions`: Generates AI-powered conversation suggestions
  - Accepts: `{ context, transcript }` where context includes userName, eventDetails, goals, participants
  - Returns: `{ suggestions: [{ text, type, priority }] }`
  - Uses OpenAI GPT-5 model with JSON response format
  - Gracefully handles missing OPENAI_API_KEY with 503 status

**OpenAI Integration**
- Model: gpt-5 (latest, released August 7, 2025)
- Parameters: max_completion_tokens (1024), response_format: json_object
- No temperature parameter (gpt-5 restriction)
- Defensive initialization: server starts even without API key
- Helpful error messages guide users to add missing credentials

### Data Storage

**Current Implementation**
- No database required for core functionality
- Context stored in browser localStorage (client-side persistence)
- Transcript stored in React state (session-only, not persisted)
- No user authentication (single-user, privacy-focused design)

**Database Configuration** (available but unused)
- Drizzle ORM configured for PostgreSQL
- Neon serverless driver ready for future expansion
- Users table schema defined but not implemented

### External Dependencies

**Core UI Libraries**
- @rive-app/react-canvas: Interactive animations
- Radix UI primitives: Accessible component foundation
- Lucide React: Icon library
- Tailwind CSS: Utility-first styling

**Backend Services**
- OpenAI SDK: GPT-5 API integration
- Express: Web server framework

**Development Tools**
- TypeScript: Static type checking
- Vite: Fast build tooling
- ESBuild: Production bundling

## Environment Variables

### Required for Full Functionality
- `OPENAI_API_KEY`: OpenAI API key for AI suggestion generation
  - Get from: https://platform.openai.com/api-keys
  - App runs without it but shows helpful 503 errors for suggestions

### Auto-Configured
- `SESSION_SECRET`: Already set for session management
- Vite environment variables automatically handled

## Development Workflow

**Starting the App**
```bash
npm run dev
```
- Starts Express server on port 5000
- Vite HMR for instant frontend updates
- Server logs show API key status on startup

**Key Files**
- `client/src/pages/Home.tsx`: Landing page with Rive animation and context pills
- `client/src/pages/SessionPage.tsx`: Active conversation page with recording and suggestions
- `client/src/components/ContextPill.tsx`: Reusable expandable pill component
- `server/routes.ts`: API endpoint for AI suggestions
- `design_guidelines.md`: UI/UX design specifications

## Known Issues

1. **Microphone Permissions**: Web Speech API requires explicit user permission
   - First-time users see browser permission prompt
   - Automated tests fail permission checks (expected behavior)
   - Production users grant permission normally

## Recent Fixes (October 10, 2025)

1. **Rive Animation Replaced**: Original Rive file had compatibility issues ("Bad header" errors)
   - Replaced with animated Lucide React microphone icon
   - Smooth pulsing animation on home page
   - Scales up on "Let's Talk!" button click
   - No console errors, production-ready

## Next Steps for Production

1. ✅ Add OPENAI_API_KEY environment variable
2. ✅ Test with real microphone permissions in browser
3. ✅ Monitor Rive asset warnings in production logs
4. ✅ Consider rate limiting for /api/suggestions endpoint
5. ✅ Add request validation (Zod) for API payloads
