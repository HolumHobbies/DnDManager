import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as nextAuth from 'next-auth';

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    character: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn().mockImplementation((body, options) => {
        return {
          status: options?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

// Import the route handlers after mocking
const { GET, POST } = jest.requireActual('../route');

describe('Characters API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/characters', () => {
    it('returns 401 when user is not authenticated', async () => {
      (nextAuth.getServerSession as jest.Mock).mockResolvedValue(null);
      
      const response = await GET();
      
      expect(response.status).toBe(401);
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    });
  });
});