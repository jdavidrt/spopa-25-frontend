// fe/src/utils/sessionManager.js
import React, { useState, useEffect } from "react";

class SessionManager {
    constructor() {
        // Apuntar directamente al servidor de sesiones
        this.baseUrl = 'http://localhost:3001'; // Session server directo

        this.listeners = new Set();
        this.currentSession = this.getInitialSession();

        // Add debug logging
        this.debug = process.env.NODE_ENV === 'development';

        if (this.debug) {
            console.log('🔧 SessionManager initialized:', {
                baseUrl: this.baseUrl,
                initialSession: this.currentSession
            });
        }
    }

    // Get initial session data from server injection
    getInitialSession() {
        if (typeof window !== 'undefined' && window.__INITIAL_SESSION__) {
            if (this.debug) {
                console.log('📥 Initial session from server:', window.__INITIAL_SESSION__);
            }
            return window.__INITIAL_SESSION__;
        }
        return {
            authenticated: false,
            user: null,
            userType: null
        };
    }

    // Add listener for session changes
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Notify all listeners of session changes
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentSession);
            } catch (error) {
                console.error('Session listener error:', error);
            }
        });
    }

    // Make API request with credentials to session server
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}/api${endpoint}`;
        const defaultOptions = {
            credentials: 'include', // Include cookies for CORS
            mode: 'cors', // Enable CORS
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        if (this.debug) {
            console.log(`🌐 Making direct request: ${options.method || 'GET'} ${url}`, {
                options: { ...defaultOptions, ...options }
            });
        }

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (this.debug) {
                console.log(`📡 Response: ${response.status} ${response.statusText}`, {
                    ok: response.ok,
                    url: response.url,
                    headers: Object.fromEntries(response.headers.entries())
                });
            }

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch {
                    errorMessage = await response.text().catch(() => errorMessage);
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            if (this.debug) {
                console.error(`❌ Request failed: ${options.method || 'GET'} ${url}`, error);
            }

            // Provide helpful error messages
            if (error.message.includes('fetch')) {
                throw new Error('Session server not responding. Make sure it\'s running on port 3001');
            }

            throw error;
        }
    }

    // Test API connectivity with better error handling
    async testConnection() {
        try {
            if (this.debug) {
                console.log('🧪 Testing connection to session server...');
            }

            const response = await this.makeRequest('/test');
            if (this.debug) {
                console.log('✅ Session server connection test successful:', response);
            }
            return true;
        } catch (error) {
            if (this.debug) {
                console.error('❌ Session server connection test failed:', error.message);
                console.log('💡 Make sure to run: npm run session-server');
            }
            return false;
        }
    }

    // Get current session from server
    async getSession() {
        try {
            if (this.debug) {
                console.log('📋 Getting session from server...');
            }

            const data = await this.makeRequest('/session');
            this.currentSession = {
                authenticated: data.authenticated,
                user: data.user,
                userType: data.userType,
                sessionId: data.sessionId
            };

            if (this.debug) {
                console.log('✅ Session retrieved:', this.currentSession);
            }

            this.notifyListeners();
            return this.currentSession;
        } catch (error) {
            if (this.debug) {
                console.warn('⚠️  Failed to get session (user may not be logged in):', error.message);
            }

            this.currentSession = {
                authenticated: false,
                user: null,
                userType: null
            };
            this.notifyListeners();
            return this.currentSession;
        }
    }

    // Initialize session after Auth0 authentication
    async initializeSession(user, userType = null) {
        try {
            if (this.debug) {
                console.log('🚀 Initializing session:', { user: user?.name, userType });
            }

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

            if (this.debug) {
                console.log('✅ Session initialized:', this.currentSession);
            }

            this.notifyListeners();
            return this.currentSession;
        } catch (error) {
            console.error('❌ Failed to initialize session:', error);
            throw error;
        }
    }

    // Update user type
    async updateUserType(userType) {
        try {
            if (this.debug) {
                console.log('🔄 Updating user type:', userType);
            }

            const data = await this.makeRequest('/session/usertype', {
                method: 'PUT',
                body: JSON.stringify({ userType })
            });

            this.currentSession = {
                ...this.currentSession,
                userType: data.userType
            };

            if (this.debug) {
                console.log('✅ User type updated:', this.currentSession);
            }

            this.notifyListeners();
            return this.currentSession;
        } catch (error) {
            console.error('❌ Failed to update user type:', error);
            throw error;
        }
    }

    // Destroy session
    async destroySession() {
        try {
            if (this.debug) {
                console.log('🗑️  Destroying session...');
            }

            await this.makeRequest('/session', {
                method: 'DELETE'
            });

            this.currentSession = {
                authenticated: false,
                user: null,
                userType: null
            };

            if (this.debug) {
                console.log('✅ Session destroyed');
            }

            this.notifyListeners();
            return this.currentSession;
        } catch (error) {
            console.error('❌ Failed to destroy session:', error);
            // Even if the request fails, clear local session state
            this.currentSession = {
                authenticated: false,
                user: null,
                userType: null
            };
            this.notifyListeners();
        }
    }

    // Get current session state (synchronous)
    getCurrentSession() {
        return this.currentSession;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentSession.authenticated;
    }

    // Get current user
    getUser() {
        return this.currentSession.user;
    }

    // Get current user type
    getUserType() {
        return this.currentSession.userType;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentSession.userType === role;
    }

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        return roles.includes(this.currentSession.userType);
    }
}

// Create singleton instance
const sessionManager = new SessionManager();

// React hook for using session manager
export const useSession = () => {
    const [session, setSession] = useState(sessionManager.getCurrentSession());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Test connection and get session on mount
        const initializeSession = async () => {
            try {
                setError(null);

                // Test API connection first
                const connectionOk = await sessionManager.testConnection();
                if (!connectionOk) {
                    throw new Error('Session server connection failed. Make sure the session server is running on port 3001.');
                }

                // Get fresh session data
                await sessionManager.getSession();
            } catch (err) {
                console.error('Session initialization error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        // Subscribe to session changes
        const unsubscribe = sessionManager.addListener((newSession) => {
            setSession(newSession);
        });

        initializeSession();

        return unsubscribe;
    }, []);

    return {
        session,
        isLoading,
        error,
        sessionManager,
        isAuthenticated: session.authenticated,
        user: session.user,
        userType: session.userType,
        initializeSession: sessionManager.initializeSession.bind(sessionManager),
        updateUserType: sessionManager.updateUserType.bind(sessionManager),
        destroySession: sessionManager.destroySession.bind(sessionManager),
        hasRole: sessionManager.hasRole.bind(sessionManager),
        hasAnyRole: sessionManager.hasAnyRole.bind(sessionManager)
    };
};

export default sessionManager;