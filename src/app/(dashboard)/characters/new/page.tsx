'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CharacterForm, CharacterFormValues } from '@/components/character/character-form';
import { Button } from '@/components/ui/button';

/**
 * Create character page
 */
export default function CreateCharacterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CharacterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create character');
      }

      const character = await response.json();
      router.push(`/characters/${character.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating character:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Character</h1>
        <Link href="/characters">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <CharacterForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}