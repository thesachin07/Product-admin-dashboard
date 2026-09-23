'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/state/AuthContext';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, isInitializing } = useAuthContext();

  useEffect(() => {
    if (!isInitializing && !user) {
      router.replace('/login');
    }
  }, [isInitializing, user, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}