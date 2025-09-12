import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface EditPageButtonPanelProps {
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  savingText?: string;
}

const EditPageButtonPanel: React.FC<EditPageButtonPanelProps> = ({
  hasChanges,
  onSave,
  onCancel,
  saving = false,
  savingText,
}) => {
  const { t } = useTranslation();

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        position: 'sticky', 
        bottom: 0, 
        zIndex: 1000,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'flex-end',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={!hasChanges || saving}
          sx={{
            color: '#d32f2f',
            borderColor: '#d32f2f',
            '&:hover': {
              borderColor: '#b71c1c',
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
            },
          }}
        >
          {t('business.cancel')}
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={!hasChanges || saving}
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
          }}
        >
          {saving ? (savingText || t('business.saving')) : t('business.save')}
        </Button>
      </Box>
    </Paper>
  );
};

export default EditPageButtonPanel;
