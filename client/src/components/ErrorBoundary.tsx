import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service if available
    if ((window as unknown as { gtag?: (event: string, action: string, params: { description: string; fatal: boolean }) => void }).gtag) {
      (window as unknown as { gtag: (event: string, action: string, params: { description: string; fatal: boolean }) => void }).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    onReset();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
        <AlertTitle>Algo deu errado!</AlertTitle>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Ocorreu um erro inesperado. Não se preocupe, seus dados estão seguros.
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          color="primary"
        >
          Ir para Início
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Recarregar Página
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
};

export default ErrorBoundary;
