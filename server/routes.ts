import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Voter search endpoint
  app.post("/api/voters/search", async (req, res) => {
    try {
      const { firstName, lastName, streetNumber, streetName } = req.body;
      
      const searchParams: any = {};
      
      if (firstName && firstName.value) {
        searchParams.firstName = {
          value: firstName.value,
          match: firstName.match || 'starts'
        };
      }
      
      if (lastName && lastName.value) {
        searchParams.lastName = {
          value: lastName.value,
          match: lastName.match || 'starts'
        };
      }
      
      if (streetNumber) {
        searchParams.streetNumber = streetNumber;
      }
      
      if (streetName && streetName.value) {
        searchParams.streetName = {
          value: streetName.value,
          match: streetName.match || 'starts'
        };
      }
      
      const voters = await storage.searchVoters(searchParams);
      res.json(voters);
    } catch (error) {
      console.error('Error searching voters:', error);
      res.status(500).json({ error: 'Failed to search voters' });
    }
  });

  return httpServer;
}
