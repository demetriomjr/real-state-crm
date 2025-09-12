import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

interface NavigationSafetyProps {
  children: React.ReactNode;
}

const NavigationSafety: React.FC<NavigationSafetyProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastValidLocation, setLastValidLocation] = useState('/');

  useEffect(() => {
    // Store the last valid location
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      setLastValidLocation(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = () => {
      console.log('Navigation detected:', location.pathname);
      
      // If user is not authenticated and trying to access protected routes
      if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
        console.log('Redirecting unauthenticated user to login');
        navigate('/login', { replace: true });
        return;
      }

      // If user is authenticated but token is invalid
      if (isAuthenticated && !token) {
        console.log('Token invalid, redirecting to login');
        toast.warning('Sessão expirada. Redirecionando para login...');
        navigate('/login', { replace: true });
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, token, navigate, location.pathname]);

  // Safe navigation function
  const safeNavigate = (path: string, options?: any) => {
    try {
      setIsNavigating(true);
      
      // Validate the path
      if (!path || typeof path !== 'string') {
        console.error('Invalid navigation path:', path);
        toast.error('Erro de navegação. Redirecionando para página inicial...');
        return;
      }

      // Check if user is authenticated for protected routes
      const protectedRoutes = ['/business', '/leads', '/customers', '/chat', '/settings'];
      const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
      
      if (isProtectedRoute && !isAuthenticated) {
        console.log('Attempting to access protected route without authentication');
        toast.warning('Você precisa fazer login para acessar esta página');
        navigate('/login', { replace: true });
        return;
      }

      // Perform navigation
      navigate(path, options);
      
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Erro de navegação. Redirecionando para página inicial...');
      navigate('/', { replace: true });
    } finally {
      setIsNavigating(false);
    }
  };

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // If it's a navigation-related error, try to recover
      if (event.reason?.message?.includes('navigation') || 
          event.reason?.message?.includes('routing')) {
        event.preventDefault();
        toast.error('Erro de navegação. Redirecionando para página inicial...');
        navigate(lastValidLocation, { replace: true });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [navigate, lastValidLocation]);

  // Expose safe navigation to window for debugging
  useEffect(() => {
    (window as any).safeNavigate = safeNavigate;
    return () => {
      delete (window as any).safeNavigate;
    };
  }, []);

  return (
    <>
      {children}
      {isNavigating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          zIndex: 9999,
          animation: 'pulse 1s ease-in-out infinite'
        }} />
      )}
    </>
  );
};

export default NavigationSafety;
