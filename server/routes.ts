import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes are handled by the Python backend
  // This frontend server only serves the React application

  const httpServer = createServer(app);
  return httpServer;
}
