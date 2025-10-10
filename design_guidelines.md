# Conversation Companion App - Design Guidelines

## Design Approach
**Reference-Based Approach**: Inspired by Granola's clean, distraction-free live transcription interface. The design prioritizes calm focus during active conversations with minimal visual noise and maximum usability during real-time interactions.

## Core Design Principles
1. **Distraction-Free Focus**: Minimal UI elements that don't interrupt conversation flow
2. **Glanceable Information**: Quick-scan suggestions that can be absorbed in seconds
3. **Touch-First Design**: Large, easy-to-tap targets for in-conversation use
4. **Progressive Disclosure**: Show context when needed, hide when not in use

## Color Palette

### Primary Colors
- **Primary Purple**: #667EEA (H: 235 S: 75% L: 66%) - Main actions, CTAs, active states
- **Secondary Purple**: #764BA2 (H: 276 S: 38% L: 46%) - Gradient accents, emphasis elements
- **Accent Green**: #48BB78 (H: 146 S: 49% L: 51%) - Success states, positive suggestions

### Neutral Colors
- **Background**: #FAFBFC - Main app background
- **Card Background**: #FFFFFF - Elevated surfaces, cards
- **Text Primary**: #2D3748 - Headings, important content
- **Text Secondary**: #A0AEC0 - Supporting text, timestamps
- **Border**: #E2E8F0 - Subtle dividers, card outlines

### Gradients
- **Primary Gradient**: Linear from #667EEA to #764BA2 (135deg) - Hero sections, CTAs
- **Subtle Gradient**: #667EEA 10% opacity to transparent - Background accents

## Typography
- **Font Stack**: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui
- **Headings**: Font weights 600-700, sizes from 1.5rem (mobile) to 2.5rem (desktop)
- **Body Text**: Font weight 400, 1rem base, 1.125rem for readability
- **Small Text**: 0.875rem for timestamps, metadata
- **Line Height**: 1.6 for body text, 1.2 for headings

## Layout System
**Tailwind Spacing Primitives**: Consistent use of 2, 4, 6, 8, 12, 16 units
- Micro spacing: p-2, gap-2 for tight elements
- Component spacing: p-4, p-6 for cards, sections
- Section spacing: py-8, py-12 for vertical rhythm
- Container: max-w-2xl for mobile-first single column, max-w-7xl for desktop expansion

## Component Library

### Cards & Containers
- **Context Card**: White background, rounded-2xl, shadow-sm, p-6, border border-gray-100
- **Suggestion Card**: White background, rounded-xl, p-4, subtle border, hover lift effect (translate-y-[-2px])
- **Sticky Panels**: Fixed positioning with backdrop-blur-sm for context awareness

### Buttons & Actions
- **Primary CTA**: Purple gradient background, white text, rounded-full, px-8 py-4, shadow-lg
- **Secondary Button**: White background, purple border-2, purple text, rounded-full, px-6 py-3
- **Icon Button**: Circular, 48px minimum touch target, purple ripple effect on tap
- **Recording Button**: Large circular (80px+), pulsing animation when active, red accent when recording

### Forms & Inputs
- **Text Input**: Border-2 border-gray-200, rounded-xl, p-4, focus:border-purple-500 transition
- **Textarea**: Same styling, min-h-32, resize-none
- **Labels**: Text-sm font-medium text-gray-700, mb-2
- **Helper Text**: Text-xs text-gray-500, mt-1

### Real-Time Elements
- **Transcript Display**: 
  - Scrollable container with max-h-64
  - Each message as a pill-shaped bubble
  - User vs AI differentiated by alignment and subtle color
  - Timestamp in muted text
  
- **Suggestion Panel**:
  - Sticky bottom positioning on mobile
  - Slide-up animation on new suggestion
  - Green accent border-l-4 for active tip
  - Icon + text + tap-to-expand pattern

### Navigation
- **Top Bar**: Sticky position, backdrop-blur, shadow-sm, h-16
- **Back Button**: Chevron-left icon, text-purple-600
- **Session Controls**: Minimalist pill-shaped toggles

## Mobile-Specific Patterns
- **Single Column Flow**: All content stacks vertically, no multi-column on <768px
- **Bottom Sheet**: Suggestions slide up from bottom, swipe-down to dismiss
- **Safe Areas**: pt-safe pb-safe for iPhone notch/home indicator
- **Thumb Zone**: Primary actions within bottom 1/3 of screen
- **Scroll Behavior**: Smooth scrolling, snap-to-section for conversation flow

## Animations
Use sparingly and purposefully:
- **Micro-interactions**: 150ms ease-in-out for button hover/active
- **Panel Transitions**: 300ms ease-out for slide-in/slide-out
- **Recording Pulse**: Subtle scale animation (1.0 to 1.05) at 1s interval
- **New Suggestion**: Fade-in + slide-up (20px) over 250ms

## Accessibility
- **Contrast Ratios**: Minimum 4.5:1 for body text, 7:1 for small text
- **Touch Targets**: Minimum 44x44px, 48x48px preferred
- **Focus States**: 3px purple outline with offset for keyboard navigation
- **Screen Reader**: aria-live="polite" for new suggestions, aria-labels on all interactive elements

## Images
**No Hero Images**: This is a utility-focused tool used during active conversations. Visual focus is on functionality, not marketing imagery. The app opens directly to actionable content (context form or active session).