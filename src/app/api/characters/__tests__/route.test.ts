import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import * as nextAuth from 'next-auth';

// Mock NextRequest and NextResponse
global.Request = jest.fn() as unknown as typeof Request;
global.Response = jest.fn() as unknown as typeof Response;

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    character: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('Characters API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/characters', () => {
    it('returns 401 when user is not authenticated', async () => {
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('returns characters for authenticated user', async () => {
      const mockSession = { user: { id: 'user1' } };
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockCharacters = [
        { id: '1', name: 'Character 1', userId: 'user1' },
        { id: '2', name: 'Character 2', userId: 'user1' },
      ];
      (prisma.character.findMany as jest.Mock).mockResolvedValue(mockCharacters);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCharacters);
      expect(prisma.character.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('handles errors gracefully', async () => {
      const mockSession = { user: { id: 'user1' } };
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.character.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'Internal server error' });
    });
  });

  describe('POST /api/characters', () => {
    it('returns 401 when user is not authenticated', async () => {
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      const request = new NextRequest('http://localhost/api/characters', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('returns 400 for invalid input', async () => {
      const mockSession = { user: { id: 'user1' } };
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const request = new NextRequest('http://localhost/api/characters', {
        method: 'POST',
        body: JSON.stringify({ name: '' }), // Invalid: empty name
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input');
    });

    it('creates a character successfully', async () => {
      const mockSession = { user: { id: 'user1' } };
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockCharacterData = {
        name: 'New Character',
        race: 'Elf',
        class: 'Wizard',
        level: 5,
        strength: 10,
        dexterity: 16,
        constitution: 12,
        intelligence: 18,
        wisdom: 14,
        charisma: 10,
        hitPoints: 30,
        maxHitPoints: 35,
        armorClass: 13,
      };
      
      const mockCreatedCharacter = {
        id: '123',
        ...mockCharacterData,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      (prisma.character.create as jest.Mock).mockResolvedValue(mockCreatedCharacter);
      
      const request = new NextRequest('http://localhost/api/characters', {
        method: 'POST',
        body: JSON.stringify(mockCharacterData),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedCharacter);
      expect(prisma.character.create).toHaveBeenCalledWith({
        data: {
          ...mockCharacterData,
          userId: 'user1',
        },
      });
    });

    it('handles errors gracefully', async () => {
      const mockSession = { user: { id: 'user1' } };
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(mockSession);
      
      const mockCharacterData = {
        name: 'New Character',
        race: 'Elf',
        class: 'Wizard',
        level: 5,
        strength: 10,
        dexterity: 16,
        constitution: 12,
        intelligence: 18,
        wisdom: 14,
        charisma: 10,
        hitPoints: 30,
        maxHitPoints: 35,
        armorClass: 13,
      };
      
      (prisma.character.create as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const request = new NextRequest('http://localhost/api/characters', {
        method: 'POST',
        body: JSON.stringify(mockCharacterData),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'Internal server error' });
    });
  });
});