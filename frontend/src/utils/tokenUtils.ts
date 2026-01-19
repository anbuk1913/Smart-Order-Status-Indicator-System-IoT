/**
 * Utility functions for JWT token management
 */

const INACTIVITY_TIMEOUT_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

interface TokenPayload {
  exp: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpirationTime = (token: string): number | null => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return payload.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilExpiry = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return 0;
  }
  return Math.max(0, expirationTime - Date.now());
};

/**
 * Store last activity timestamp
 */
export const updateLastActivity = (): void => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

/**
 * Get last activity timestamp
 */
export const getLastActivity = (): number | null => {
  const lastActivity = localStorage.getItem('lastActivity');
  return lastActivity ? parseInt(lastActivity, 10) : null;
};

/**
 * Check if user has been inactive for more than 6 hours
 */
export const isInactivityExpired = (): boolean => {
  const lastActivity = getLastActivity();
  if (!lastActivity) {
    return false; // No activity recorded yet
  }

  const timeSinceLastActivity = Date.now() - lastActivity;
  return timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS;
};

/**
 * Clear activity tracking
 */
export const clearActivityTracking = (): void => {
  localStorage.removeItem('lastActivity');
};
