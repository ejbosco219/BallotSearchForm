import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { getDb } from "./mongodb";
import type { Voter } from "../client/src/types/voter";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Voter methods
  searchVoters(params: {
    firstName?: { value: string; match: 'starts' | 'within' | 'ends' };
    lastName?: { value: string; match: 'starts' | 'within' | 'ends' };
    streetNumber?: string;
    streetName?: { value: string; match: 'starts' | 'within' | 'ends' };
  }): Promise<Voter[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async searchVoters(params: {
    firstName?: { value: string; match: 'starts' | 'within' | 'ends' };
    lastName?: { value: string; match: 'starts' | 'within' | 'ends' };
    streetNumber?: string;
    streetName?: { value: string; match: 'starts' | 'within' | 'ends' };
  }): Promise<Voter[]> {
    const db = getDb();
    const collection = db.collection('voters');
    
    const query: any = {};
    
    // Build MongoDB query based on match types
    if (params.firstName) {
      const { value, match } = params.firstName;
      if (match === 'starts') {
        query.firstName = { $regex: `^${value}`, $options: 'i' };
      } else if (match === 'within') {
        query.firstName = { $regex: value, $options: 'i' };
      } else if (match === 'ends') {
        query.firstName = { $regex: `${value}$`, $options: 'i' };
      }
    }
    
    if (params.lastName) {
      const { value, match } = params.lastName;
      if (match === 'starts') {
        query.lastName = { $regex: `^${value}`, $options: 'i' };
      } else if (match === 'within') {
        query.lastName = { $regex: value, $options: 'i' };
      } else if (match === 'ends') {
        query.lastName = { $regex: `${value}$`, $options: 'i' };
      }
    }
    
    if (params.streetNumber) {
      query['address.streetNumber'] = params.streetNumber;
    }
    
    if (params.streetName) {
      const { value, match } = params.streetName;
      if (match === 'starts') {
        query['address.street'] = { $regex: `^${value}`, $options: 'i' };
      } else if (match === 'within') {
        query['address.street'] = { $regex: value, $options: 'i' };
      } else if (match === 'ends') {
        query['address.street'] = { $regex: `${value}$`, $options: 'i' };
      }
    }
    
    // If no search criteria provided, return empty array
    if (Object.keys(query).length === 0) {
      return [];
    }
    
    const voters = await collection
      .find(query)
      .limit(1000) // Safety limit
      .toArray();
    
    return voters as unknown as Voter[];
  }
}

export const storage = new MemStorage();
