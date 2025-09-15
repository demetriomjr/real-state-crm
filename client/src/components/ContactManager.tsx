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
  Email as EmailIcon,
  Phone as PhoneIcon,
  PhoneAndroid as CellphoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { CONTACT_TYPES, type ContactType, formatPhone, formatCellphone } from '../utils/validation';
import { getContactValidationErrorMessage } from '../utils/validation';

interface Contact {
  id?: string;
  contact_name?: string;
  contact_type: ContactType;
  contact_value: string;
  is_whatsapp?: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ContactManagerProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  disabled?: boolean;
}

const ContactManager: React.FC<ContactManagerProps> = ({
  contacts,
  onContactsChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'phone':
        return <PhoneIcon />;
      case 'cellphone':
        return <CellphoneIcon />;
      default:
        return <PhoneIcon />;
    }
  };

  const getContactTypeLabel = (type: ContactType) => {
    return t(`contact.types.${type}`);
  };

  const validateContact = (contact: Contact): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!contact.contact_type) {
      newErrors.contact_type = t('contact.validation.typeRequired');
    }

    if (!contact.contact_value.trim()) {
      newErrors.contact_value = t('contact.validation.valueRequired');
    } else {
      const validationError = getContactValidationErrorMessage(contact.contact_type, contact.contact_value, t);
      if (validationError) {
        newErrors.contact_value = validationError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    if (contacts.length >= 10) {
      toast.error(t('contact.maxItemsReached'));
      return;
    }
    
    const newContact: Contact = {
      contact_name: '',
      contact_type: 'email',
      contact_value: '',
      is_whatsapp: false,
      is_default: false,
    };
    setEditingContact(newContact);
    setIsAdding(true);
    setErrors({});
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact({ ...contact });
    setIsAdding(false);
    setErrors({});
  };

  const handleSaveContact = () => {
    if (!editingContact || !validateContact(editingContact)) {
      return;
    }

    let updatedContacts: Contact[];

    if (isAdding) {
      // Add new contact
      const newContact = {
        ...editingContact,
        id: `temp_${Date.now()}`, // Temporary ID for new contacts
      };
      
      // If this is the first contact of this type and user didn't explicitly set it, make it default automatically
      const existingContactsOfType = contacts.filter(c => c.contact_type === editingContact.contact_type);
      if (existingContactsOfType.length === 0 && !editingContact.is_default) {
        newContact.is_default = true;
      }
      
      updatedContacts = [...contacts, newContact];
    } else {
      // Update existing contact
      updatedContacts = contacts.map(contact =>
        contact.id === editingContact.id ? editingContact : contact
      );
    }

    // Handle default logic - ensure only one default per type
    const contactsOfType = updatedContacts.filter(c => c.contact_type === editingContact.contact_type);
    
    // If the current contact is being set as default, unset all others of the same type first
    if (editingContact.is_default) {
      updatedContacts = updatedContacts.map(contact => {
        if (contact.contact_type === editingContact.contact_type) {
          // For new contacts, compare by position in the array
          // For existing contacts, compare by ID
          if (isAdding) {
            // If adding, unset all existing contacts of this type
            return contact.id?.startsWith('temp_') ? contact : { ...contact, is_default: false };
          } else {
            // If editing, unset all others except the current one
            return contact.id !== editingContact.id ? { ...contact, is_default: false } : contact;
          }
        }
        return contact;
      });
    }
    
    // If no default exists for this type, make the first one default
    const defaultContactsOfType = updatedContacts.filter(c => c.contact_type === editingContact.contact_type && c.is_default);
    if (defaultContactsOfType.length === 0 && contactsOfType.length > 0) {
      updatedContacts = updatedContacts.map(contact => {
        if (contact.contact_type === editingContact.contact_type && contact.id === contactsOfType[0].id) {
          return { ...contact, is_default: true };
        }
        return contact;
      });
    }

    onContactsChange(updatedContacts);
    setEditingContact(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDeleteContact = (contactId: string) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    if (!contactToDelete) return;
    
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    
    // If we deleted the default contact of this type, make another one default
    if (contactToDelete.is_default) {
      const remainingContactsOfType = updatedContacts.filter(c => c.contact_type === contactToDelete.contact_type);
      if (remainingContactsOfType.length > 0) {
        // Make the first remaining contact of this type default
        const updatedContactsWithNewDefault = updatedContacts.map(contact => {
          if (contact.contact_type === contactToDelete.contact_type && contact.id === remainingContactsOfType[0].id) {
            return { ...contact, is_default: true };
          }
          return contact;
        });
        onContactsChange(updatedContactsWithNewDefault);
        return;
      }
    }
    
    onContactsChange(updatedContacts);
  };

  const handleCancel = () => {
    setEditingContact(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Contact, value: string | boolean) => {
    if (!editingContact) return;

    let processedValue = value;

    // Apply formatting for contact_value based on contact_type
    if (field === 'contact_value' && typeof value === 'string') {
      const contactType = editingContact.contact_type;
      if (contactType === 'phone') {
        processedValue = formatPhone(value);
      } else if (contactType === 'cellphone') {
        processedValue = formatCellphone(value);
      }
    }

    setEditingContact(prev => ({
      ...prev!,
      [field]: processedValue,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const formatContactValueForDisplay = (contactType: ContactType, contactValue: string): string => {
    switch (contactType) {
      case 'phone':
        return formatPhone(contactValue);
      case 'cellphone':
        return formatCellphone(contactValue);
      case 'email':
      default:
        return contactValue;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddContact}
            size="small"
          >
            {t('contact.manager.addContact')}
          </Button>
        )}
      </Box>

      {/* Existing Contacts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {contacts.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('contact.manager.noRecords')}
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getContactIcon(contact.contact_type)}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.contact_name || getContactTypeLabel(contact.contact_type)}
                          {contact.is_whatsapp && (
                            <Chip 
                              label="WhatsApp" 
                              size="small" 
                              color="success" 
                              sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Typography>
                        <Typography variant="body1">
                          {formatContactValueForDisplay(contact.contact_type, contact.contact_value)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {contact.is_default && (
                        <Chip label={t('contact.default')} size="small" color="primary" />
                      )}
                      {!disabled && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditContact(contact)}
                            title={t('contact.actions.edit')}
                            aria-label={t('contact.actions.edit')}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteContact(contact.id!)}
                            color="error"
                            title={t('contact.actions.delete')}
                            aria-label={t('contact.actions.delete')}
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
        )}
      </Box>

      {/* Edit Dialog */}
      <EditDialog
        open={!!editingContact}
        onClose={handleCancel}
        onSave={handleSaveContact}
        title={isAdding ? t('contact.manager.addContact') : t('contact.manager.editContact')}
        saveDisabled={false}
        saveText={isAdding ? t('common.add') : t('common.save')}
      >
        {editingContact && (
          <>
            <TextField
              fullWidth
              label={t('contact.name')}
              value={editingContact.contact_name || ''}
              onChange={(e) => handleFieldChange('contact_name', e.target.value)}
              error={!!errors.contact_name}
              helperText={errors.contact_name || t('contact.help.name')}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth error={!!errors.contact_type} sx={{ mb: 2 }}>
              <InputLabel>{t('contact.type')}</InputLabel>
              <Select
                value={editingContact.contact_type}
                onChange={(e) => handleFieldChange('contact_type', e.target.value)}
                label={t('contact.type')}
              >
                {CONTACT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getContactIcon(type)}
                      {getContactTypeLabel(type)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.contact_type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.contact_type}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label={t('contact.value')}
              value={editingContact.contact_value}
              onChange={(e) => handleFieldChange('contact_value', e.target.value)}
              error={!!errors.contact_value}
              helperText={errors.contact_value || t(`contact.help.${editingContact.contact_type}`)}
              type={editingContact.contact_type === 'email' ? 'email' : 'tel'}
              sx={{ mb: 2 }}
            />

            {/* WhatsApp toggle - only show for phone and cellphone */}
            {(editingContact.contact_type === 'phone' || editingContact.contact_type === 'cellphone') && (
              <FormControlLabel
                control={
                  <Switch
                    checked={editingContact.is_whatsapp || false}
                    onChange={(e) => handleFieldChange('is_whatsapp', e.target.checked)}
                  />
                }
                label={t('contact.whatsapp')}
                sx={{ display: 'block', mb: 1 }}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={editingContact.is_default}
                  onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                  disabled={
                    !isAdding && 
                    editingContact.is_default && 
                    contacts.filter(c => c.contact_type === editingContact.contact_type && c.is_default).length === 1
                  }
                />
              }
              label={t('contact.default')}
              sx={{ display: 'block', mt: 1 }}
            />
          </>
        )}
      </EditDialog>
    </Box>
  );
};

export default ContactManager;
