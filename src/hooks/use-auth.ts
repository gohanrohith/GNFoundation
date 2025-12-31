import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const TOKEN_KEY = 'admin-auth-token';
const LAST_ACTIVITY_KEY = 'admin-last-activity';
const LOGOUT_REASON_KEY = 'admin-logout-reason';

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is valid and not expired
  const validateToken = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!token || !lastActivity) {
      return false;
    }

    const lastActivityTime = parseInt(lastActivity);
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;

    // Check if user has been inactive for more than 15 minutes
    if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
      return false;
    }

    return true;
  }, []);

  // Logout user
  const logout = useCallback((reason?: string) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);

    if (reason) {
      localStorage.setItem(LOGOUT_REASON_KEY, reason);
    }

    setIsAuthenticated(false);

    if (reason === 'inactivity') {
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to 15 minutes of inactivity.',
        variant: 'destructive',
      });
    }

    router.replace('/login');
  }, [router, toast]);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [isAuthenticated]);

  // Check authentication status
  const checkAuth = useCallback(() => {
    const isValid = validateToken();

    if (!isValid && isAuthenticated) {
      // User was authenticated but session expired
      logout('inactivity');
      return false;
    } else if (!isValid) {
      // User was never authenticated
      logout();
      return false;
    }

    setIsAuthenticated(true);
    updateActivity();
    return true;
  }, [validateToken, logout, updateActivity, isAuthenticated]);

  // Set up activity listeners
  useEffect(() => {
    // Activities that reset the inactivity timer
    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    activities.forEach(activity => {
      window.addEventListener(activity, updateActivity);
    });

    return () => {
      activities.forEach(activity => {
        window.removeEventListener(activity, updateActivity);
      });
    };
  }, [updateActivity]);

  // Check auth on mount and set up interval to check periodically
  useEffect(() => {
    checkAuth();
    setIsLoading(false);

    // Check authentication status every minute
    const interval = setInterval(() => {
      if (!validateToken() && isAuthenticated) {
        logout('inactivity');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAuth, validateToken, logout]);

  // Check auth on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      checkAuth();
    };

    // Check auth when component mounts or route changes
    handleRouteChange();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    logout,
    updateActivity,
  };
}

// Utility function to login (store token)
export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

// Utility function to check if user is authenticated (without hook)
export function isUserAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

  if (!token || !lastActivity) {
    return false;
  }

  const lastActivityTime = parseInt(lastActivity);
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivityTime;

  return timeSinceLastActivity <= INACTIVITY_TIMEOUT;
}
