import React from 'react';
import Link from 'next/link';
import { Character } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, truncateString } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  onDelete?: (id: string) => void;
}

/**
 * Card component for displaying character information
 */
export function CharacterCard({ character, onDelete }: CharacterCardProps) {
  const getAbilityModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{character.name}</span>
          <span className="text-sm font-normal text-gray-500">
            Level {character.level} {character.race} {character.class}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">STR</div>
            <div className="font-bold">{character.strength}</div>
            <div className="text-xs">{getAbilityModifier(character.strength)}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">DEX</div>
            <div className="font-bold">{character.dexterity}</div>
            <div className="text-xs">{getAbilityModifier(character.dexterity)}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">CON</div>
            <div className="font-bold">{character.constitution}</div>
            <div className="text-xs">{getAbilityModifier(character.constitution)}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">INT</div>
            <div className="font-bold">{character.intelligence}</div>
            <div className="text-xs">{getAbilityModifier(character.intelligence)}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">WIS</div>
            <div className="font-bold">{character.wisdom}</div>
            <div className="text-xs">{getAbilityModifier(character.wisdom)}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-500">CHA</div>
            <div className="font-bold">{character.charisma}</div>
            <div className="text-xs">{getAbilityModifier(character.charisma)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-red-100 rounded">
            <div className="text-xs text-gray-500">HP</div>
            <div className="font-bold">{character.hitPoints}/{character.maxHitPoints}</div>
          </div>
          <div className="text-center p-2 bg-blue-100 rounded">
            <div className="text-xs text-gray-500">AC</div>
            <div className="font-bold">{character.armorClass}</div>
          </div>
          <div className="text-center p-2 bg-green-100 rounded">
            <div className="text-xs text-gray-500">XP</div>
            <div className="font-bold">{character.experience}</div>
          </div>
        </div>

        {character.notes && (
          <div className="mt-2 text-sm text-gray-600">
            <p>{truncateString(character.notes, 100)}</p>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          Last updated: {formatDate(character.updatedAt)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link href={`/characters/${character.id}`} passHref>
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
        <div className="space-x-2">
          <Link href={`/characters/${character.id}/edit`} passHref>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          {onDelete && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onDelete(character.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}