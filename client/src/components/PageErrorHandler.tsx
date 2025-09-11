import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { Home as HomeIcon, Refresh as RefreshIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

interface PageErrorHandlerProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

const PageErrorHandler: React.FC<PageErrorHandlerProps> = ({
  children,
  fallbackTitle = "Erro ao carregar página",
  fallbackMessage = "Ocorreu um erro ao carregar esta página. Tente novamente ou volte para a página inicial.",
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Page error caught:', event.error);
      setError(event.error);
      setHasError(true);
      
      if (onError) {
        onError(event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in page:', event.reason);
      setError(new Error(event.reason?.message || 'Promise rejection'));
      setHasError(true);
      
      if (onError) {
        onError(new Error(event.reason?.message || 'Promise rejection'));
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  const handleRetry = () => {
    setIsRetrying(true);
    setHasError(false);
    setError(null);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsRetrying(false);
    }, 1000);
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  if (hasError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
          <AlertTitle>{fallbackTitle}</AlertTitle>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {fallbackMessage}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            color="primary"
            disabled={isRetrying}
          >
            {isRetrying ? <CircularProgress size={20} /> : 'Tentar Novamente'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleGoBack}
          >
            Voltar
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            Página Inicial
          </Button>
        </Box>

        {import.meta.env.DEV && error && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxWidth: 800 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Detalhes do Erro (Desenvolvimento):
            </Typography>
            <Typography variant="body2" component="pre" sx={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              fontSize: '0.75rem',
              color: 'error.main'
            }}>
              {error.toString()}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return <>{children}</>;
};

export default PageErrorHandler;
