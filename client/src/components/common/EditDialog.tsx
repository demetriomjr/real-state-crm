import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
  saveDisabled?: boolean;
  saveText?: string;
  cancelText?: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  children,
  saveDisabled = false,
  saveText = 'Salvar',
  cancelText = 'Cancelar',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        backgroundColor: '#C1BAA1', 
        color: '#2c2c2c',
        fontWeight: 600,
        borderBottom: '1px solid #ddd',
        p: 2
      }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={saveDisabled}
          sx={{
            backgroundColor: '#8B7D6B',
            minWidth: 100,
            '&:hover': {
              backgroundColor: '#6B5B4F',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#666',
            },
          }}
        >
          {saveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
