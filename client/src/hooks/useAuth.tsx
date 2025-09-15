import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginRequest, User } from '../types/auth';
import authService from '../services/authService';

// Hook to ensure i18n is loaded before rendering components
export const useI18nReady = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    console.log('useI18nReady: Starting i18n readiness check');

    const checkI18nReady = () => {
      // Import i18n dynamically to ensure it's loaded
      import('../i18n/index').then(({ default: i18n }) => {
        console.log('useI18nReady: i18n module loaded');

        if (i18n.isInitialized) {
          console.log('useI18nReady: i18n is already initialized');
          setIsI18nReady(true);
        } else {
          console.log('useI18nReady: i18n not yet initialized, waiting...');

          // Listen for initialization
          i18n.on('initialized', () => {
            console.log('useI18nReady: i18n initialized event received');
            setIsI18nReady(true);
          });

          i18n.on('loaded', () => {
            console.log('useI18nReady: i18n loaded event received');
            setIsI18nReady(true);
          });

          // Fallback timeout
          setTimeout(() => {
            console.log('useI18nReady: Fallback timeout reached, setting ready');
            setIsI18nReady(true);
          }, 2000);
        }
      }).catch((error) => {
        console.error('useI18nReady: Failed to load i18n module:', error);
        // Fallback to ready state
        setIsI18nReady(true);
      });
    };

    checkI18nReady();
  }, []);

  console.log('useI18nReady: Returning readiness state', isI18nReady);
  return isI18nReady;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();
        
        if (storedToken && authService.isTokenValid() && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // Only clear localStorage if we had auth data but it's invalid
          if (storedToken || storedUser) {
            localStorage.removeItem('token');
            localStorage.removeItem('userSecret');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            // Don't show toast here - let individual components handle it
          }
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      // Clear browser cache on login for fresh SaaS experience
      if (typeof window !== 'undefined') {
        try {
          // Clear all caches for the current origin
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          }

          // Force reload of static assets by clearing service worker cache
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(
              registrations.map(registration => registration.unregister())
            );
          }

          // Clear localStorage cache keys (keep only auth data)
          const keysToKeep = ['token', 'userSecret', 'tokenExpiry', 'user'];
          const allKeys = Object.keys(localStorage);
          allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          });

          console.log('Browser cache cleared successfully on login');
        } catch (cacheError) {
          console.warn('Failed to clear some cache items:', cacheError);
          // Don't fail the login if cache clearing fails
        }
      }

      // Update auth state synchronously to ensure it's available immediately
      setToken(response.token);
      setUser(response.user);
      
      // Ensure loading is set to false after state updates
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  const updateAuthData = (token: string, userSecret: string, expiresAt: string, userData?: User) => {
    // Store the new auth data
    localStorage.setItem('token', token);
    localStorage.setItem('userSecret', userSecret);
    localStorage.setItem('tokenExpiry', expiresAt);
    
    // Update the context state
    setToken(token);
    
    // Use the provided user data or create a temporary user object
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // Fallback to temporary user object if no user data provided
      const tempUser: User = {
        id: 'temp',
        fullName: 'Usuário',
        // Note: username, user_level, and roles removed for security
      };
      setUser(tempUser);
      localStorage.setItem('user', JSON.stringify(tempUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateAuthData,
    isAuthenticated: !!user && !!token && authService.isTokenValid(),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
