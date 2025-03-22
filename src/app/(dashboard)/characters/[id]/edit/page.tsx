'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CharacterForm, CharacterFormValues } from '@/components/character/character-form';
import { Button } from '@/components/ui/button';
import { Character } from '@prisma/client';

interface EditCharacterPageProps {
  params: {
    id: string;
  };
}

/**
 * Edit character page
 */
export default function EditCharacterPage({ params }: EditCharacterPageProps) {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch character data
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/characters/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/characters');
            return;
          }
          throw new Error('Failed to fetch character');
        }
        
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
        setError('Failed to load character data');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchCharacter();
  }, [params.id, router]);

  const handleSubmit = async (data: CharacterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/characters/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update character');
      }

      router.push(`/characters/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating character:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Character not found</h2>
        <p className="mt-2 text-gray-500">The character you're looking for doesn't exist or you don't have permission to view it.</p>
        <div className="mt-4">
          <Link href="/characters">
            <Button>Back to Characters</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Character: {character.name}</h1>
        <Link href={`/characters/${params.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <CharacterForm 
          character={character} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}