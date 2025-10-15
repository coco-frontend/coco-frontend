/**
 * Session-related type definitions
 */

export type AppState = "nameEntry" | "contextMenu" | "editingContext" | "recording";

export type ContextField = "eventDetails" | "goals" | "participants";

export interface Suggestion {
  text: string;
  type: string;
  priority: string;
  timestamp?: string;
}

export interface TranscriptEntry {
  speaker: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface SessionSummary {
  stars: string[];
  wish: string;
  filler_percentage: number;
  takeaways: string[];
  summary_bullets: string[];
}

export interface SessionContext {
  userName: string;
  eventDetails: string;
  goals: string;
  participants: string;
}
