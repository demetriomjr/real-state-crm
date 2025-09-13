import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditDialog from './common/EditDialog';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DOCUMENT_TYPES, 
  type DocumentType, 
  validateDocumentType, 
  validateDocumentNumber, 
  formatDocumentNumber,
  getDocumentValidationErrorMessage 
} from '../utils/validation';

interface Document {
  id?: string;
  document_type: string;
  document_number: string;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface DocumentManagerProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
  disabled?: boolean;
}

// Document types are now imported from validation.ts

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onDocumentsChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getDocumentTypeLabel = (type: DocumentType) => {
    return t(`document.types.${type}`);
  };

  const validateDocument = (document: Document): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!document.document_type) {
      newErrors.document_type = t('document.validation.typeRequired');
    } else if (!validateDocumentType(document.document_type)) {
      newErrors.document_type = getDocumentValidationErrorMessage(document.document_type, document.document_number, t);
    }

    if (!document.document_number.trim()) {
      newErrors.document_number = t('document.validation.numberRequired');
    } else if (!validateDocumentNumber(document.document_type, document.document_number)) {
      newErrors.document_number = getDocumentValidationErrorMessage(document.document_type, document.document_number, t);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = () => {
    const newDocument: Document = {
      document_type: 'cpf',
      document_number: '',
      is_default: false,
    };
    setEditingDocument(newDocument);
    setIsAdding(true);
    setErrors({});
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument({ ...document });
    setIsAdding(false);
    setErrors({});
  };

  const handleSaveDocument = () => {
    if (!editingDocument || !validateDocument(editingDocument)) {
      return;
    }

    let updatedDocuments: Document[];

    if (isAdding) {
      const newDocument = {
        ...editingDocument,
        id: `temp_${Date.now()}`,
      };
      
      // If this is the first document of this type and user didn't explicitly set it, make it default automatically
      const existingDocumentsOfType = documents.filter(d => d.document_type === editingDocument.document_type);
      if (existingDocumentsOfType.length === 0 && !editingDocument.is_default) {
        newDocument.is_default = true;
      }
      
      updatedDocuments = [...documents, newDocument];
    } else {
      updatedDocuments = documents.map(document =>
        document.id === editingDocument.id ? editingDocument : document
      );
    }

    // Handle default logic - ensure only one default per type
    const documentsOfType = updatedDocuments.filter(d => d.document_type === editingDocument.document_type);
    
    // If the current document is being set as default, unset all others of the same type first
    if (editingDocument.is_default) {
      updatedDocuments = updatedDocuments.map(document => {
        if (document.document_type === editingDocument.document_type) {
          // For new documents, compare by position in the array
          // For existing documents, compare by ID
          if (isAdding) {
            // If adding, unset all existing documents of this type
            return document.id?.startsWith('temp_') ? document : { ...document, is_default: false };
          } else {
            // If editing, unset all others except the current one
            return document.id !== editingDocument.id ? { ...document, is_default: false } : document;
          }
        }
        return document;
      });
    }
    
    // If no default exists for this type, make the first one default
    const defaultDocumentsOfType = updatedDocuments.filter(d => d.document_type === editingDocument.document_type && d.is_default);
    if (defaultDocumentsOfType.length === 0 && documentsOfType.length > 0) {
      updatedDocuments = updatedDocuments.map(document => {
        if (document.document_type === editingDocument.document_type && document.id === documentsOfType[0].id) {
          return { ...document, is_default: true };
        }
        return document;
      });
    }

    onDocumentsChange(updatedDocuments);
    setEditingDocument(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDeleteDocument = (documentId: string) => {
    const documentToDelete = documents.find(d => d.id === documentId);
    if (!documentToDelete) return;
    
    const updatedDocuments = documents.filter(document => document.id !== documentId);
    
    // If we deleted the default document of this type, make another one default
    if (documentToDelete.is_default) {
      const remainingDocumentsOfType = updatedDocuments.filter(d => d.document_type === documentToDelete.document_type);
      if (remainingDocumentsOfType.length > 0) {
        // Make the first remaining document of this type default
        const updatedDocumentsWithNewDefault = updatedDocuments.map(document => {
          if (document.document_type === documentToDelete.document_type && document.id === remainingDocumentsOfType[0].id) {
            return { ...document, is_default: true };
          }
          return document;
        });
        onDocumentsChange(updatedDocumentsWithNewDefault);
        return;
      }
    }
    
    onDocumentsChange(updatedDocuments);
  };

  const handleCancel = () => {
    setEditingDocument(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Document, value: string | boolean) => {
    if (!editingDocument) return;

    let processedValue = value;
    
    // Format document number based on document type
    if (field === 'document_number' && typeof value === 'string' && editingDocument.document_type) {
      processedValue = formatDocumentNumber(editingDocument.document_type, value);
    }

    setEditingDocument(prev => ({
      ...prev!,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {t('document.manager.title')}
        </Typography>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDocument}
            size="small"
            sx={{ ml: { xs: 'auto', sm: 0 } }}
          >
            {t('document.manager.addDocument')}
          </Button>
        )}
      </Box>

      {/* Existing Documents */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <AnimatePresence>
          {documents.map((document) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DocumentIcon />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {getDocumentTypeLabel(document.document_type as DocumentType)}
                        </Typography>
                        <Typography variant="body1">
                          {formatDocumentNumber(document.document_type, document.document_number)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {document.is_default && (
                        <Chip label={t('document.default')} size="small" color="primary" />
                      )}
                      {!disabled && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditDocument(document)}
                            title={t('document.actions.edit')}
                            aria-label={t('document.actions.edit')}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDocument(document.id!)}
                            color="error"
                            title={t('document.actions.delete')}
                            aria-label={t('document.actions.delete')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Edit Dialog */}
      <EditDialog
        open={!!editingDocument}
        onClose={handleCancel}
        onSave={handleSaveDocument}
        title={isAdding ? t('document.manager.addDocument') : t('document.manager.editDocument')}
        saveDisabled={false}
        saveText={isAdding ? t('common.add') : t('common.save')}
      >
        {editingDocument && (
          <>
            <FormControl fullWidth error={!!errors.document_type} sx={{ mb: 2 }}>
              <InputLabel>{t('document.type')}</InputLabel>
              <Select
                value={editingDocument.document_type}
                onChange={(e) => handleFieldChange('document_type', e.target.value)}
                label={t('document.type')}
              >
                {DOCUMENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {getDocumentTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
              {errors.document_type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.document_type}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label={t('document.number')}
              value={editingDocument.document_number}
              onChange={(e) => handleFieldChange('document_number', e.target.value)}
              error={!!errors.document_number}
              helperText={errors.document_number || t('document.help.number')}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editingDocument.is_default}
                  onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                  disabled={
                    !isAdding && 
                    editingDocument.is_default && 
                    documents.filter(d => d.document_type === editingDocument.document_type && d.is_default).length === 1
                  }
                />
              }
              label={t('document.default')}
              sx={{ display: 'block', mt: 1 }}
            />
          </>
        )}
      </EditDialog>
    </Box>
  );
};

export default DocumentManager;
