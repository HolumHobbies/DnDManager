import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { CharacterList } from '@/components/character/character-list';

export const metadata: Metadata = {
  title: 'Characters | D&D Campaign Manager',
  description: 'Manage your D&D characters',
};

/**
 * Characters page
 */
export default async function CharactersPage() {
  const session = await getServerSession(authOptions);
  
  // Get all characters for the current user
  const characters = await prisma.character.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Characters</h1>
        <Link href="/characters/new">
          <Button>Create Character</Button>
        </Link>
      </div>
      
      <CharacterList characters={characters} />
    </div>
  );
}