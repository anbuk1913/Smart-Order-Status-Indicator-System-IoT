import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../types/auth';
import {
  isTokenExpired,
  isInactivityExpired,
  updateLastActivity,
} from '../utils/tokenUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkIntervalRef = useRef<number | null>(null);

  const checkAuth = () => {
    const token = authService.getToken();
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      authService.logout();
      setIsAuthenticated(false);
      setLoading(false);
      window.dispatchEvent(new Event('auth-token-expired'));
      return;
    }

    if (isInactivityExpired()) {
      authService.logout();
      setIsAuthenticated(false);
      setLoading(false);
      window.dispatchEvent(new Event('auth-token-expired'));
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleTokenExpired = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();

    checkIntervalRef.current = window.setInterval(() => {
      checkAuth();
    }, 60000);

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      const token = authService.getToken();
      if (token && !isTokenExpired(token)) {
        updateLastActivity();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    const handleCustomStorageChange = () => {
      checkAuth();
    };

    const handleTokenExpiredEvent = () => {
      handleTokenExpired();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-storage-change', handleCustomStorageChange);
    window.addEventListener('auth-token-expired', handleTokenExpiredEvent);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-storage-change', handleCustomStorageChange);
      window.removeEventListener('auth-token-expired', handleTokenExpiredEvent);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    authService.setToken(response.access_token);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('auth-storage-change'));
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-storage-change'));
  };

  return { isAuthenticated, loading, login, logout };
};