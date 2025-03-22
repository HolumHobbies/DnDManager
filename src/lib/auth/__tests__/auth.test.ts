import { authenticateUser, createUser } from '../auth';
import { prisma } from '../../prisma';
import { compare } from 'bcryptjs';

// Mock the prisma client
jest.mock('../../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('returns null when user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await authenticateUser('nonexistent', 'password');
      
      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
    });

    it('authenticates user without password when user has no password', async () => {
      const mockUser = { id: '1', username: 'user', password: null };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await authenticateUser('user');
      
      expect(result).toEqual(mockUser);
      expect(compare).not.toHaveBeenCalled();
    });

    it('returns null when password is provided but user has no password', async () => {
      const mockUser = { id: '1', username: 'user', password: null };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await authenticateUser('user', 'password');
      
      expect(result).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    });

    it('returns null when password is not provided but user has a password', async () => {
      const mockUser = { id: '1', username: 'user', password: 'hashed_password' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await authenticateUser('user');
      
      expect(result).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    });

    it('returns user when password matches', async () => {
      const mockUser = { id: '1', username: 'user', password: 'hashed_password' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);
      
      const result = await authenticateUser('user', 'correct_password');
      
      expect(result).toEqual(mockUser);
      expect(compare).toHaveBeenCalledWith('correct_password', 'hashed_password');
    });

    it('returns null when password does not match', async () => {
      const mockUser = { id: '1', username: 'user', password: 'hashed_password' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);
      
      const result = await authenticateUser('user', 'wrong_password');
      
      expect(result).toBeNull();
      expect(compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
    });
  });

  describe('createUser', () => {
    it('throws error when user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', username: 'existing' });
      
      await expect(createUser('existing')).rejects.toThrow('User already exists');
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'existing' },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('creates user without password when password is not provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const mockUser = { id: '1', username: 'newuser', password: null };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await createUser('newuser');
      
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'newuser',
          password: null,
        },
      });
    });

    it('creates user with hashed password when password is provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const mockUser = { id: '1', username: 'newuser', password: 'hashed_password' };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await createUser('newuser', 'password123');
      
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'newuser',
          password: 'hashed_password',
        },
      });
    });
  });
});