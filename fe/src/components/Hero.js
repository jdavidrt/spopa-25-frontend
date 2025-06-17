// fe/src/components/Hero.js
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSession } from "../utils/sessionManager";
import logo from "../assets/SPOPALogo.png";

const Hero = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const {
    session,
    initializeSession,
    updateUserType,
    isAuthenticated: sessionAuthenticated
  } = useSession();

  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [error, setError] = useState(null);

  const roles = ["Estudiante", "Administrativo", "Empresa"];

  // Initialize server session when Auth0 authentication completes
  useEffect(() => {
    const initSession = async () => {
      if (isAuthenticated && user && !sessionAuthenticated && !isInitializingSession) {
        setIsInitializingSession(true);
        setError(null);

        try {
          await initializeSession(user);
          console.log('Session initialized successfully');
        } catch (error) {
          console.error('Failed to initialize session:', error);
          setError('Failed to initialize session. Please try refreshing the page.');
        } finally {
          setIsInitializingSession(false);
        }
      }
    };

    if (!isLoading) {
      initSession();
    }
  }, [isAuthenticated, user, sessionAuthenticated, isInitializingSession, isLoading, initializeSession]);

  const handleRoleSelect = async (role) => {
    setError(null);

    try {
      await updateUserType(role);
      console.log(`User type updated to: ${role}`);
    } catch (error) {
      console.error('Failed to update user type:', error);
      setError('Failed to update user role. Please try again.');
    }
  };

  // Show loading state
  if (isLoading || isInitializingSession) {
    return (
      <div className="text-center hero my-5">
        <img className="mb-3 app-logo" src={logo} alt="SPOPA logo" width="120" />
        <h1 className="mb-4">SPOPA</h1>
        <div className="mb-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-muted">
            {isLoading ? 'Authenticating...' : 'Initializing session...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center hero my-5">
        <img className="mb-3 app-logo" src={logo} alt="SPOPA logo" width="120" />
        <h1 className="mb-4">SPOPA</h1>
        <div className="mb-4">
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center hero my-5">
      {sessionAuthenticated && (
        <div className="mb-4">
          {!session.userType ? (
            <>
              <h5 className="mb-3 text-primary">Welcome, {session.user?.name}!</h5>
              <h6 className="mb-2">Please select your role:</h6>
              <div className="d-flex justify-content-center gap-3 mb-2 flex-wrap">
                {roles.map((role) => (
                  <button
                    key={role}
                    className="btn btn-outline-primary mx-1 mb-2"
                    onClick={() => handleRoleSelect(role)}
                    disabled={isInitializingSession}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <small className="text-muted">
                You can change your role later in your profile settings
              </small>
            </>
          ) : (
            <div className="alert alert-success" role="alert">
              <p className="mb-1">
                <strong>Welcome back, {session.user?.name}!</strong>
              </p>
              <p className="mb-0">
                Current role: <span className="badge badge-primary">{session.userType}</span>
              </p>
            </div>
          )}
        </div>
      )}

      <img className="mb-3 app-logo" src={logo} alt="SPOPA logo" width="120" />
      <h1 className="mb-4">SPOPA</h1>

      {!sessionAuthenticated && (
        <div className="mb-4">
          <p className="lead text-muted">
            Student Professional Opportunities Platform for Academia
          </p>
          <p className="text-muted">
            Please log in to access your dashboard and manage your internship process.
          </p>
        </div>
      )}
    </div>
  );
};

export default Hero;