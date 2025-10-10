import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/suggestions", async (req, res) => {
    try {
      const { context, transcript } = req.body;

      if (!transcript || transcript.length === 0) {
        return res.json({ suggestions: [] });
      }

      // Build context prompt
      let contextPrompt = "You are COCO, a real-time conversation companion. Your role is to provide helpful, actionable suggestions to guide the user during their conversation.\n\n";
      
      if (context?.userName) {
        contextPrompt += `User: ${context.userName}\n`;
      }
      if (context?.eventDetails) {
        contextPrompt += `Event: ${context.eventDetails}\n`;
      }
      if (context?.goals) {
        contextPrompt += `Goals: ${context.goals}\n`;
      }
      if (context?.participants) {
        contextPrompt += `Participants: ${context.participants}\n`;
      }

      // Build transcript context
      const transcriptText = transcript.map((t: any) => `[${t.timestamp}] ${t.text}`).join('\n');
      
      const prompt = `${contextPrompt}

Based on the conversation below, provide 2-3 actionable suggestions to help the user navigate the conversation effectively. Keep suggestions concise, specific, and helpful.

Conversation transcript:
${transcriptText}

Respond with a JSON object containing an array of suggestions. Each suggestion should have:
- "text": The suggestion text (1-2 sentences max)
- "type": One of "question", "tip", or "response" 
- "priority": "high" or "normal"

Format: { "suggestions": [{ "text": "...", "type": "...", "priority": "..." }] }`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are COCO, a helpful conversation companion that provides concise, actionable suggestions in real-time."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
      
      res.json(result);
    } catch (error: any) {
      console.error('Error generating suggestions:', error);
      res.status(500).json({ 
        error: 'Failed to generate suggestions',
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
