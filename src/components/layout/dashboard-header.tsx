import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

/**
 * Header component for dashboard layout
 */
export function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                D&D Campaign Manager
              </Link>
            </div>
            <nav className="ml-6 flex space-x-4 items-center">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link 
                href="/characters" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Characters
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}