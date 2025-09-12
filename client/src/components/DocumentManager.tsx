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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id?: string;
  document_type: string;
  document_number: string;
  person_id: string;
  is_primary: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface DocumentManagerProps {
  documents: Document[];
  personId: string;
  onDocumentsChange: (documents: Document[]) => void;
  disabled?: boolean;
}

const DOCUMENT_TYPES = ['cpf', 'cnpj', 'rg', 'passport', 'driver_license'] as const;
type DocumentType = typeof DOCUMENT_TYPES[number];

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  personId,
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
    }

    if (!document.document_number.trim()) {
      newErrors.document_number = t('document.validation.numberRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = () => {
    const newDocument: Document = {
      document_type: 'cpf',
      document_number: '',
      person_id: personId,
      is_primary: false,
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
      updatedDocuments = [...documents, newDocument];
    } else {
      updatedDocuments = documents.map(document =>
        document.id === editingDocument.id ? editingDocument : document
      );
    }

    // Handle default logic - only one default per type
    if (editingDocument.is_default) {
      updatedDocuments = updatedDocuments.map(document => {
        if (document.document_type === editingDocument.document_type && document.id !== editingDocument.id) {
          return { ...document, is_default: false };
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
    const updatedDocuments = documents.filter(document => document.id !== documentId);
    onDocumentsChange(updatedDocuments);
  };

  const handleCancel = () => {
    setEditingDocument(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Document, value: any) => {
    if (!editingDocument) return;

    setEditingDocument(prev => ({
      ...prev!,
      [field]: value,
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
        <Typography variant="h6">{t('document.manager.title')}</Typography>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDocument}
            size="small"
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
                          {document.document_number}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {document.is_default && (
                        <Chip label={t('document.default')} size="small" color="primary" />
                      )}
                      {document.is_primary && (
                        <Chip label={t('document.primary')} size="small" color="secondary" />
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

      {/* Add/Edit Form */}
      {editingDocument && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Card variant="outlined" sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isAdding ? t('document.manager.addDocument') : t('document.manager.editDocument')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth error={!!errors.document_type}>
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
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingDocument.is_primary}
                        onChange={(e) => handleFieldChange('is_primary', e.target.checked)}
                      />
                    }
                    label={t('document.primary')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingDocument.is_default}
                        onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                      />
                    }
                    label={t('document.default')}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveDocument}
                  >
                    {isAdding ? t('common.add') : t('common.save')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default DocumentManager;
