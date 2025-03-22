import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/auth-options';

// Validation schema for character update
const characterUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  race: z.string().min(1, 'Race is required').optional(),
  class: z.string().min(1, 'Class is required').optional(),
  level: z.number().int().min(1).max(20).optional(),
  strength: z.number().int().min(1).max(30).optional(),
  dexterity: z.number().int().min(1).max(30).optional(),
  constitution: z.number().int().min(1).max(30).optional(),
  intelligence: z.number().int().min(1).max(30).optional(),
  wisdom: z.number().int().min(1).max(30).optional(),
  charisma: z.number().int().min(1).max(30).optional(),
  hitPoints: z.number().int().min(0).optional(),
  maxHitPoints: z.number().int().min(1).optional(),
  armorClass: z.number().int().min(1).optional(),
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
 * GET /api/characters/[id] - Get a specific character
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const character = await prisma.character.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!character) {
      return NextResponse.json(
        { message: 'Character not found' },
        { status: 404 }
      );
    }
    
    // Check if the character belongs to the current user
    if (character.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/characters/[id] - Update a character
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if character exists and belongs to the user
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingCharacter) {
      return NextResponse.json(
        { message: 'Character not found' },
        { status: 404 }
      );
    }
    
    if (existingCharacter.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const result = characterUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const characterData = result.data;
    
    // Update character
    const updatedCharacter = await prisma.character.update({
      where: {
        id: params.id,
      },
      data: characterData,
    });
    
    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/characters/[id] - Delete a character
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if character exists and belongs to the user
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingCharacter) {
      return NextResponse.json(
        { message: 'Character not found' },
        { status: 404 }
      );
    }
    
    if (existingCharacter.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete character
    await prisma.character.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json(
      { message: 'Character deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}