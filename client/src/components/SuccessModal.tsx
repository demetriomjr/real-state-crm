import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  title,
  message,
  buttonText = 'Continuar',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.1 
          }}
        >
          <CheckCircle 
            sx={{ 
              fontSize: 80, 
              color: 'success.main',
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
            }} 
          />
        </motion.div>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: '1.1rem'
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            minWidth: 120,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
            }
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
