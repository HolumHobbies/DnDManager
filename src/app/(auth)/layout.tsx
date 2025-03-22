import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-options';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout for authentication pages
 */
export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Check if user is already authenticated
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}