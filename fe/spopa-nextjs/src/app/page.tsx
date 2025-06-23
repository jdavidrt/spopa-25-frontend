'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSession } from '../lib/session-manager';
import NavigationBar from '../components/navbar';

export default function Home() {
  const { user, isLoading } = useUser();
  const { session, initializeSession, updateUserType, isLoading: sessionLoading } = useSession();
  const [isInitializing, setIsInitializing] = useState(false);

  const roles = ["Estudiante", "Administrativo", "Empresa"];

  useEffect(() => {
    const initSession = async () => {
      if (user && !session.authenticated && !isInitializing) {
        setIsInitializing(true);
        try {
          await initializeSession(user);
        } catch (error) {
          console.error('Failed to initialize session:', error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    if (!isLoading && !sessionLoading) {
      initSession();
    }
  }, [user, session.authenticated, isLoading, sessionLoading, isInitializing, initializeSession]);

  const handleRoleSelect = async (role: string) => {
    try {
      await updateUserType(role);
    } catch (error) {
      console.error('Failed to update user type:', error);
    }
  };

  if (isLoading || sessionLoading || isInitializing) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <div className="container flex-grow-1 mt-5">
        <div className="text-center my-5">
          <h1 className="mb-4">SPOPA</h1>
          <p className="lead text-muted">
            Student Professional Opportunities Platform for Academia
          </p>

          {session.authenticated && !session.userType && (
            <div className="mt-4">
              <h5 className="mb-3 text-primary">Welcome, {session.user?.name}!</h5>
              <h6 className="mb-3">Please select your role:</h6>
              <div className="d-flex justify-content-center gap-3 mb-2 flex-wrap">
                {roles.map((role) => (
                  <button
                    key={role}
                    className="btn btn-outline-primary"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <small className="text-muted">
                You can change your role later in your profile settings
              </small>
            </div>
          )}

          {session.authenticated && session.userType && (
            <div className="alert alert-success mt-4" role="alert">
              <p className="mb-1">
                <strong>Welcome back, {session.user?.name}!</strong>
              </p>
              <p className="mb-0">
                Current role: <span className="badge bg-primary">{session.userType}</span>
              </p>
            </div>
          )}

          {!session.authenticated && (
            <div className="mt-4">
              <p className="text-muted">
                Please log in to access your dashboard and manage your internship process.
              </p>
              <a className="btn btn-primary" href="/api/auth/login">
                Log In
              </a>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-light p-3 text-center mt-auto">
        <p className="mb-0">SPOPA - 25 - Grupo 1E</p>
      </footer>
    </div>
  );
}