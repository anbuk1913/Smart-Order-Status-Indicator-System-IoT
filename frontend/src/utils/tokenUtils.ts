const INACTIVITY_TIMEOUT_MS = 6 * 60 * 60 * 1000; // 6 hours

interface TokenPayload {
  exp: number;
  sub?: string;
  [key: string]: any;
}

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

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  return currentTime >= expirationTime;
};

export const getTokenExpirationTime = (token: string): number | null => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return payload.exp * 1000;
};

export const getTimeUntilExpiry = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return 0;
  }
  return Math.max(0, expirationTime - Date.now());
};

export const updateLastActivity = (): void => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

export const getLastActivity = (): number | null => {
  const lastActivity = localStorage.getItem('lastActivity');
  return lastActivity ? parseInt(lastActivity, 10) : null;
};

export const isInactivityExpired = (): boolean => {
  const lastActivity = getLastActivity();
  if (!lastActivity) {
    return false;
  }
  const timeSinceLastActivity = Date.now() - lastActivity;
  return timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS;
};

export const clearActivityTracking = (): void => {
  localStorage.removeItem('lastActivity');
};