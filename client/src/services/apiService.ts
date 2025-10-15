import { BACKEND_URL } from '@/lib/constants';
import type { SessionSummary } from '@/types/session';

/**
 * API service for backend communication
 */
export class APIService {
  async createSession(
    userName: string,
    context: string,
    goal: string
  ): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: context || 'General conversation',
        goal: goal || 'Have a great conversation',
        user_name: userName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    return data.session_id;
  }

  async finishSession(sessionId: string): Promise<SessionSummary> {
    const response = await fetch(`${BACKEND_URL}/session/${sessionId}/finish`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to get session summary');
    }

    return await response.json();
  }
}

export const apiService = new APIService();
