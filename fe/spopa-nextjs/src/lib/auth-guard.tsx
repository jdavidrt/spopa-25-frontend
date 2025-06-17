'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useSession } from '@/lib/session-manager';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallbackPath?: string;
}

export default function AuthGuard({ 
  children, 
  allowedRoles = [], 
  fallbackPath = '/' 
}: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const { session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !sessionLoading) {
      const isAuthenticated = session.authenticated || !!user;
      const userType = session.userType;

      if (!isAuthenticated) {
        router.push('/api/auth/login');
        return;
      }

      if (allowedRoles.length > 0 && (!userType || !allowedRoles.includes(userType))) {
        router.push(fallbackPath);
        return;
      }
    }
  }, [user, session, isLoading, sessionLoading, allowedRoles, fallbackPath, router]);

  if (isLoading || sessionLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isAuthenticated = session.authenticated || !!user;
  const userType = session.userType;

  if (!isAuthenticated || (allowedRoles.length > 0 && (!userType || !allowedRoles.includes(userType)))) {
    return null;
  }

  return <>{children}</>;
}