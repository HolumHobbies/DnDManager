import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/auth-options';

// Validation schema for character creation/update
const characterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  race: z.string().min(1, 'Race is required'),
  class: z.string().min(1, 'Class is required'),
  level: z.number().int().min(1).max(20),
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
  hitPoints: z.number().int().min(0),
  maxHitPoints: z.number().int().min(1),
  armorClass: z.number().int().min(1),
  background: z.string().optional(),
  alignment: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  proficiencies: z.string().optional(),
  equipment: z.string().optional(),
  spells: z.string().optional(),
  features: z.string().optional(),
  notes: z.string().optional(),
  campaignId: z.string().optional(),
});

/**
 * GET /api/characters - Get all characters for the current user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/characters - Create a new character
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const result = characterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const characterData = result.data;
    
    // Create character
    const character = await prisma.character.create({
      data: {
        ...characterData,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}