'use client';

import { useState, useEffect, useCallback } from 'react';

interface SessionData {
  authenticated: boolean;
  user: any;
  userType: string | null;
  sessionId?: string;
}

class SessionManager {
  private baseUrl: string;
  private listeners: Set<(session: SessionData) => void>;
  private currentSession: SessionData;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SESSION_SERVER_URL || 'http://localhost:3001';
    this.listeners = new Set();
    this.currentSession = {
      authenticated: false,
      user: [],
      userType: null
    };
  }

  addListener(callback: (session: SessionData) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentSession);
      } catch (error) {
        console.error('Session listener error:', error);
      }
    });
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const defaultOptions: RequestInit = {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getSession(): Promise<SessionData> {
    try {
      const data = await this.makeRequest('/session');
      this.currentSession = {
        authenticated: data.authenticated,
        user: data.user,
        userType: data.userType,
        sessionId: data.sessionId
      };
      this.notifyListeners();
      return this.currentSession;
    } catch (error) {
      this.currentSession = {
        authenticated: false,
        user: [],
        userType: null
      };
      this.notifyListeners();
      return this.currentSession;
    }
  }

  async initializeSession(user: any, userType?: string): Promise<SessionData> {
    const data = await this.makeRequest('/session/init', {
      method: 'POST',
      body: JSON.stringify({ user, userType })
    });

    this.currentSession = {
      authenticated: true,
      user: data.user,
      userType: data.userType,
      sessionId: data.sessionId
    };
    this.notifyListeners();
    return this.currentSession;
  }

  async updateUserType(userType: string): Promise<SessionData> {
    const data = await this.makeRequest('/session/usertype', {
      method: 'PUT',
      body: JSON.stringify({ userType })
    });

    this.currentSession = {
      ...this.currentSession,
      userType: data.userType
    };
    this.notifyListeners();
    return this.currentSession;
  }

  async destroySession(): Promise<void> {
    try {
      await this.makeRequest('/session', { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to destroy session:', error);
    }
    
    this.currentSession = {
      authenticated: false,
      user: null,
      userType: null
    };
    this.notifyListeners();
  }

  getCurrentSession(): SessionData {
    return this.currentSession;
  }
}

const sessionManager = new SessionManager();

export const useSession = () => {
  const [session, setSession] = useState<SessionData>(sessionManager.getCurrentSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = sessionManager.addListener(setSession);
    
    // Initialize session on mount
    sessionManager.getSession().finally(() => setIsLoading(false));

    return unsubscribe;
  }, []);

  const initializeSession = useCallback((user: any, userType?: string) => {
    return sessionManager.initializeSession(user, userType);
  }, []);

  const updateUserType = useCallback((userType: string) => {
    return sessionManager.updateUserType(userType);
  }, []);

  const destroySession = useCallback(() => {
    return sessionManager.destroySession();
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: session.authenticated,
    user: session.user,
    userType: session.userType,
    initializeSession,
    updateUserType,
    destroySession
  };
};

export default sessionManager;