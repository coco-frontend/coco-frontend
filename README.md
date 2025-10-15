# COCO - Conversation Coach Frontend

Modern React application for real-time conversation coaching powered by AI.

## Features

- Real-time audio recording and transcription
- Live AI coaching suggestions
- Beautiful animated UI with Rive
- Session management and feedback
- Responsive design with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Wouter** - Routing
- **Rive** - Animations
- **Web Audio API** - Audio processing

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment (optional):**
```bash
# Create .env file if you want to customize the backend URL
echo "VITE_BACKEND_URL=http://localhost:8000" > .env
```

3. **Run development server:**
```bash
PORT=3000 npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
client/src/
├── components/
│   └── ui/              # Radix UI components
├── hooks/
│   └── useLocalStorage.ts  # Custom hooks
├── lib/
│   ├── constants.ts     # App constants
│   └── queryClient.ts   # React Query setup
├── pages/
│   ├── Home.tsx         # Main application page
│   └── not-found.tsx    # 404 page
├── services/
│   ├── apiService.ts    # Backend API calls
│   ├── audioService.ts  # Audio recording
│   └── websocketService.ts  # WebSocket handling
├── types/
│   └── session.ts       # TypeScript types
├── App.tsx              # App root
└── main.tsx             # Entry point

server/
├── index.ts             # Express server
├── routes.ts            # API routes (minimal)
└── vite.ts              # Vite dev server setup
```

## Architecture Highlights

### Service Layer
The application uses a clean service layer pattern:

- **APIService**: HTTP requests to backend (create/finish session)
- **WebSocketService**: Real-time communication with backend
- **AudioService**: Microphone recording and PCM audio processing

### State Management
- **Local state**: React hooks for UI state
- **localStorage**: Persistent user context
- **WebSocket events**: Real-time updates from backend

### Audio Pipeline
1. Capture microphone input with Web Audio API
2. Convert Float32 to Int16 PCM (16kHz, mono)
3. Stream to backend via WebSocket
4. Receive transcripts and suggestions in real-time

## User Flow

1. **Name Entry**: User enters their name
2. **Context Setup**: Optional event details, goals, participants
3. **Recording Session**:
   - Real-time transcription
   - Live coaching suggestions (text + audio)
   - Pause/resume controls
4. **Feedback**: AI-generated summary with stars, wish, and takeaways

## Development

### Type Safety
Full TypeScript coverage with strict mode enabled.

### Code Organization
- Single Responsibility Principle
- Separation of concerns (UI, business logic, services)
- Reusable hooks and utilities
- Typed API contracts

### Performance
- Code splitting with lazy loading
- Optimized re-renders with proper memoization
- Efficient audio processing with Web Workers pattern

## Backend Integration

The frontend communicates with the Python FastAPI backend:

- **REST API**: Session creation and completion
- **WebSocket**: Real-time audio streaming and feedback
- **Backend URL**: Configurable via `VITE_BACKEND_URL` env var

## Build

```bash
npm run build
```

Production build outputs to `dist/`

## Common Issues

### Port 5000 Conflict (macOS)
macOS AirPlay uses port 5000. Use `PORT=3000 npm run dev` instead.

### Microphone Permission
Ensure browser has microphone access permissions enabled.

### WebSocket Connection
Verify backend is running on the configured `VITE_BACKEND_URL`.
