import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * Home page - redirects to dashboard if authenticated, otherwise to login
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
  
  // This will never be rendered
  return null;
}
