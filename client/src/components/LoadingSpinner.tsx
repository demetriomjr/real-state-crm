import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

interface LoadingSpinnerProps {
  open: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ open, message = 'Carregando...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Greyish background with opacity
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{
            color: '#2E7D32', // Primary green color
          }}
        />
        <Box
          sx={{
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {message}
        </Box>
      </Box>
    </Backdrop>
  );
};

export default LoadingSpinner;
