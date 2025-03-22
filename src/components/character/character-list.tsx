import React from 'react';
import { Character } from '@prisma/client';
import { CharacterCard } from './character-card';

interface CharacterListProps {
  characters: Character[];
  onDelete?: (id: string) => void;
}

/**
 * Component for displaying a list of characters
 */
export function CharacterList({ characters, onDelete }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">No characters found</h3>
        <p className="text-gray-400">Create a new character to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <CharacterCard 
          key={character.id} 
          character={character} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}