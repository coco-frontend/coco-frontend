import { BACKEND_URL, WEBSOCKET_EVENTS } from '@/lib/constants';
import type { TranscriptEntry, Suggestion } from '@/types/session';

interface WebSocketMessage {
  type: string;
  text?: string;
  speaker?: string;
  timestamp?: string;
  data?: string;
  format?: string;
  message?: string;
}

interface WebSocketCallbacks {
  onTranscript: (entry: TranscriptEntry) => void;
  onSuggestion: (suggestion: Suggestion) => void;
  onAudio: (data: string) => void;
  onError: (error: string) => void;
}

/**
 * WebSocket service for managing real-time communication with backend
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallbacks | null = null;

  connect(sessionId: string, callbacks: WebSocketCallbacks): void {
    this.callbacks = callbacks;

    const wsUrl = BACKEND_URL.replace('http', 'ws');
    this.ws = new WebSocket(`${wsUrl}/ws/${sessionId}`);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case WEBSOCKET_EVENTS.TRANSCRIPT:
            if (message.text && message.speaker && message.timestamp) {
              this.callbacks?.onTranscript({
                speaker: message.speaker as 'user' | 'coach',
                text: message.text,
                timestamp: message.timestamp,
              });
            }
            break;

          case WEBSOCKET_EVENTS.SUGGESTION:
            if (message.text && message.timestamp) {
              this.callbacks?.onSuggestion({
                text: message.text,
                type: 'tip',
                priority: 'high',
                timestamp: message.timestamp,
              });
            }
            break;

          case WEBSOCKET_EVENTS.AUDIO:
            if (message.data) {
              this.callbacks?.onAudio(message.data);
            }
            break;

          case WEBSOCKET_EVENTS.ERROR:
            this.callbacks?.onError(message.message || 'Unknown error');
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.callbacks?.onError('WebSocket connection error');
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  sendAudio(data: ArrayBuffer): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  stop(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: WEBSOCKET_EVENTS.STOP }));
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks = null;
  }
}

/**
 * Play base64-encoded audio
 */
export function playAudioBase64(base64Audio: string): void {
  try {
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}
