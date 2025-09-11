import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface SaveCancelPanelProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveText?: string;
  cancelText?: string;
  editText?: string;
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
  editDisabled?: boolean;
}

const SaveCancelPanel: React.FC<SaveCancelPanelProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saveText = 'Salvar',
  cancelText = 'Cancelar',
  editText = 'Editar',
  saveDisabled = false,
  cancelDisabled = false,
  editDisabled = false,
}) => {
  return (
    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
      {!isEditing ? (
        <Button
          variant="contained"
          onClick={onEdit}
          disabled={editDisabled}
          startIcon={<EditIcon />}
        >
          {editText}
        </Button>
      ) : (
        <ButtonGroup variant="contained" aria-label="save cancel buttons">
          <Button
            onClick={onSave}
            disabled={saveDisabled}
            startIcon={<SaveIcon />}
            color="primary"
          >
            {saveText}
          </Button>
          <Button
            onClick={onCancel}
            disabled={cancelDisabled}
            startIcon={<CancelIcon />}
            color="secondary"
            variant="outlined"
          >
            {cancelText}
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default SaveCancelPanel;
