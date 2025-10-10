# COCO - Conversation Companion App

## Overview

COCO (Conversation Companion) is a real-time conversation assistant application that provides AI-powered suggestions during live conversations. The app uses browser-based speech recognition to transcribe conversations in the background and leverages OpenAI's GPT-5 to generate contextual, actionable suggestions. The design emphasizes a distraction-free, mobile-first interface with ChatGPT-style expandable pills for context entry and Rive animations for visual feedback.

## Recent Updates (October 10, 2025)

### ✅ Completed Features
1. **Single-Screen State Machine**: Redesigned to use one page with state-based UI transitions (name entry → context menu → individual editing → recording)
2. **Custom Background Image**: Mobile-friendly centered layout with user's landing_background.webp as clean background (no overlay or gradient)
3. **Rive Animation Integration**: Updated to use coco.riv animation displayed throughout all states
4. **Streamlined Context Flow**: Name input first, then context pills appear with individual field editing and back button
5. **Recording State UI**: Shows recording indicator, pause/resume, and end session buttons with white suggestion pills
6. **OpenAI Backend Integration**: GPT-5 powered suggestion generation with graceful error handling for missing API keys

### 🔧 Technical Implementation
- **Single-Screen Architecture**: State machine with 4 states (nameEntry, contextMenu, editingContext, recording) - all on one page
- **Background**: Vite asset import system (`@assets/landing_background.webp`) for proper image loading
- **Animation**: Rive file displayed across all states
- **Transparent Design**: Card component with no borders/shadows (bg-transparent border-0 shadow-none)
- **White Typography**: All text elements use #ffffff for visibility over background
- **Custom Button Styling**: Cream/beige CTA button (#FFE8C9) with black text, borderless
- **Web Speech API**: Browser-native audio transcription with graceful permission handling
- **localStorage**: Context persistence and rehydration across sessions
- **POST /api/suggestions**: AI suggestion generation endpoint
- **Responsive error handling**: Toast notifications for user feedback
- **Mobile-first layout**: Centered design (max-width: 28rem)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Single-page application with state machine architecture (no routing)

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
- **State Machine Architecture**: Single-screen app with 4 distinct states
  - nameEntry: Initial name input and confirmation
  - contextMenu: Context pills selection and "Let's Talk!" button
  - editingContext: Individual field editing with back navigation
  - recording: Active conversation with AI suggestions
  
- **Speech Recognition**: Browser-native Web Speech API (webkitSpeechRecognition) for real-time transcription
  - Continuous mode with interim results
  - Automatic restart on connection drop (using refs to avoid stale closures)
  - Graceful permission handling (stays in recording state when denied)
  
- **Rive Animations**: Interactive character animations displayed across all states
  - Loading trigger fires on page load
  - Voice starts trigger fires when starting a session
  - Located at /attached_assets/coco.riv
  
- **Context Management**: Streamlined input flow
  - Name entry first, then context pills (Event Details, Goals, Participants)
  - Individual field editing with dedicated state
  - Auto-save to localStorage, rehydrates on page load
  - Visual checkmarks indicate filled pills
  
- **AI Suggestions**: Real-time conversation guidance powered by OpenAI GPT-5
  - Contextual suggestions based on user profile and conversation transcript
  - Display as white pills during recording state
  - Categorized by type (question, tip, response) and priority (high, normal)
  - Graceful degradation when API key is missing

**Mobile-First Design**
- Touch-optimized UI with 44px+ tap targets
- Transparent card design showcasing background image
- Rounded-full pill buttons for modern aesthetic
- All white typography for visibility over background
- Cream/beige CTA button (#FFE8C9) with black text
- Centered layout (max-width: 28rem) for mobile focus

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
- `client/src/pages/Home.tsx`: Single-screen app with state machine (nameEntry → contextMenu → editingContext → recording)
- `client/src/App.tsx`: Root component with single route (/)
- `server/routes.ts`: API endpoint for AI suggestions
- `design_guidelines.md`: UI/UX design specifications

## Known Issues

1. **Rive Animation Console Warnings**: "Bad header" / "Problem loading file" errors appear in browser console
   - Non-blocking: Animation loads and functions correctly
   - May indicate file format compatibility issue
   - Monitor in production to ensure asset integrity

2. **Microphone Permissions**: Web Speech API requires explicit user permission
   - First-time users see browser permission prompt
   - Automated tests fail permission checks (expected behavior)
   - Production users grant permission normally

## Next Steps for Production

1. ✅ Add OPENAI_API_KEY environment variable
2. ✅ Test with real microphone permissions in browser
3. ✅ Monitor Rive asset warnings in production logs
4. ✅ Consider rate limiting for /api/suggestions endpoint
5. ✅ Add request validation (Zod) for API payloads
