import { compare, hash } from 'bcryptjs';
import { prisma } from '../prisma';

/**
 * Authenticates a user with username and password
 */
export async function authenticateUser(username: string, password?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  // If password is not provided and user has no password (optional as per requirements)
  if (!password && !user.password) {
    return user;
  }

  // If password is provided but user has no password
  if (password && !user.password) {
    return null;
  }

  // If password is not provided but user has a password
  if (!password && user.password) {
    return null;
  }

  // If both password and user.password exist, verify the password
  const isValid = await compare(password!, user.password!);
  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Creates a new user
 */
export async function createUser(username: string, password?: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password if provided
  const hashedPassword = password ? await hash(password, 10) : null;

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return user;
}