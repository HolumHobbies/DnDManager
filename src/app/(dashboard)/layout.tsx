import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-options';
import { DashboardHeader } from '@/components/layout/dashboard-header';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout for dashboard and protected pages
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}