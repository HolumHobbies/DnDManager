import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Dashboard | D&D Campaign Manager',
  description: 'Manage your D&D campaigns and characters',
};

/**
 * Dashboard page
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Get character count
  const characterCount = await prisma.character.count({
    where: {
      userId: session?.user?.id,
    },
  });
  
  // Get campaign count
  const campaignCount = await prisma.campaign.count({
    where: {
      userId: session?.user?.id,
    },
  });
  
  // Get recent characters
  const recentCharacters = await prisma.character.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 3,
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/characters/new">
          <Button>Create Character</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{characterCount}</p>
            <p className="text-gray-500 mt-2">Total characters created</p>
            <div className="mt-4">
              <Link href="/characters">
                <Button variant="outline" className="w-full">View All Characters</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{campaignCount}</p>
            <p className="text-gray-500 mt-2">Total campaigns created</p>
            <div className="mt-4">
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Characters</h2>
        {recentCharacters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCharacters.map((character) => (
              <Card key={character.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Level {character.level} {character.race} {character.class}
                  </p>
                  <div className="mt-4">
                    <Link href={`/characters/${character.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Character
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">
                You haven&apos;t created any characters yet.
              </p>
              <div className="mt-4 text-center">
                <Link href="/characters/new">
                  <Button>Create Your First Character</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}