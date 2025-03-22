import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Character Details | D&D Campaign Manager',
  description: 'View character details',
};

interface CharacterPageProps {
  params: {
    id: string;
  };
}

/**
 * Character details page
 */
export default async function CharacterPage({ params }: CharacterPageProps) {
  const session = await getServerSession(authOptions);
  
  // Get character details
  const character = await prisma.character.findUnique({
    where: {
      id: params.id,
    },
  });
  
  // Check if character exists and belongs to the current user
  if (!character || character.userId !== session?.user?.id) {
    notFound();
  }
  
  // Calculate ability modifiers
  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : modifier.toString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{character.name}</h1>
        <div className="space-x-2">
          <Link href={`/characters/${character.id}/edit`}>
            <Button variant="outline">Edit Character</Button>
          </Link>
          <Link href="/characters">
            <Button variant="secondary">Back to Characters</Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Character Info</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Race:</span>
                  <span className="font-medium">{character.race}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Class:</span>
                  <span className="font-medium">{character.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">{character.level}</span>
                </div>
                {character.background && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Background:</span>
                    <span className="font-medium">{character.background}</span>
                  </div>
                )}
                {character.alignment && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Alignment:</span>
                    <span className="font-medium">{character.alignment}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience:</span>
                  <span className="font-medium">{character.experience}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Ability Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">STR</div>
                  <div className="font-bold text-lg">{character.strength}</div>
                  <div className="text-sm">{getModifier(character.strength)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">DEX</div>
                  <div className="font-bold text-lg">{character.dexterity}</div>
                  <div className="text-sm">{getModifier(character.dexterity)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">CON</div>
                  <div className="font-bold text-lg">{character.constitution}</div>
                  <div className="text-sm">{getModifier(character.constitution)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">INT</div>
                  <div className="font-bold text-lg">{character.intelligence}</div>
                  <div className="text-sm">{getModifier(character.intelligence)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">WIS</div>
                  <div className="font-bold text-lg">{character.wisdom}</div>
                  <div className="text-sm">{getModifier(character.wisdom)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-xs text-gray-500">CHA</div>
                  <div className="font-bold text-lg">{character.charisma}</div>
                  <div className="text-sm">{getModifier(character.charisma)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Combat Stats</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-3 bg-red-100 rounded">
                  <div className="text-xs text-gray-500">HIT POINTS</div>
                  <div className="font-bold text-lg">{character.hitPoints}/{character.maxHitPoints}</div>
                </div>
                <div className="text-center p-3 bg-blue-100 rounded">
                  <div className="text-xs text-gray-500">ARMOR CLASS</div>
                  <div className="font-bold text-lg">{character.armorClass}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {character.proficiencies && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Proficiencies</h2>
                <div className="p-4 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                  {character.proficiencies}
                </div>
              </div>
            )}
            
            {character.equipment && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Equipment</h2>
                <div className="p-4 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                  {character.equipment}
                </div>
              </div>
            )}
            
            {character.spells && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Spells</h2>
                <div className="p-4 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                  {character.spells}
                </div>
              </div>
            )}
            
            {character.features && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Features & Traits</h2>
                <div className="p-4 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                  {character.features}
                </div>
              </div>
            )}
          </div>
          
          {character.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <div className="p-4 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                {character.notes}
              </div>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Created: {formatDate(character.createdAt)}</p>
            <p>Last updated: {formatDate(character.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}