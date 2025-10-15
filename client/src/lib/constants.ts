/**
 * Application constants
 */

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  BITS_PER_SAMPLE: 16,
  BUFFER_SIZE: 4096,
  MIN_AUDIO_LENGTH: 16000 * 2, // 1 second
};

export const WEBSOCKET_EVENTS = {
  TRANSCRIPT: 'transcript',
  SUGGESTION: 'suggestion',
  AUDIO: 'audio',
  ERROR: 'error',
  STOP: 'stop',
} as const;
