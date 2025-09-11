import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface EditPageButtonPanelProps {
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  savingText?: string;
}

const EditPageButtonPanel: React.FC<EditPageButtonPanelProps> = ({
  onSave,
  onCancel,
  saving = false,
  savingText,
}) => {
  const { t } = useTranslation();

  // Shared width styles for consistency
  const sharedWidthStyles = {
    maxWidth: { xs: '100%', md: 1200 },
    mx: 'auto',
    width: '100%'
  };

  return (
    <Box sx={sharedWidthStyles}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2 },
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end'
        }}
      >
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            disabled={saving}
            sx={{
              color: '#d32f2f',
              borderColor: '#d32f2f',
              '&:hover': {
                borderColor: '#b71c1c',
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
              },
            }}
          >
            {t('common.cancel')}
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={saving}
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            {saving ? (savingText || t('business.saving')) : t('common.save')}
          </Button>
        </Paper>
    </Box>
  );
};

export default EditPageButtonPanel;
