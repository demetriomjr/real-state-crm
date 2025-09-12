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
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  PhoneAndroid as CellphoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT_TYPES, type ContactType } from '../utils/validation';
import { getContactValidationErrorMessage } from '../utils/validation';

interface Contact {
  id?: string;
  contact_type: ContactType;
  contact_value: string;
  person_id: string;
  is_primary: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ContactManagerProps {
  contacts: Contact[];
  personId: string;
  onContactsChange: (contacts: Contact[]) => void;
  disabled?: boolean;
}

const ContactManager: React.FC<ContactManagerProps> = ({
  contacts,
  personId,
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
      case 'whatsapp':
        return <WhatsAppIcon />;
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
      const validationError = getContactValidationErrorMessage(contact.contact_type, contact.contact_value);
      if (validationError) {
        newErrors.contact_value = validationError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    const newContact: Contact = {
      contact_type: 'email',
      contact_value: '',
      person_id: personId,
      is_primary: false,
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
      updatedContacts = [...contacts, newContact];
    } else {
      // Update existing contact
      updatedContacts = contacts.map(contact =>
        contact.id === editingContact.id ? editingContact : contact
      );
    }

    // Handle default logic - only one default per type
    if (editingContact.is_default) {
      updatedContacts = updatedContacts.map(contact => {
        if (contact.contact_type === editingContact.contact_type && contact.id !== editingContact.id) {
          return { ...contact, is_default: false };
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
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onContactsChange(updatedContacts);
  };

  const handleCancel = () => {
    setEditingContact(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Contact, value: any) => {
    if (!editingContact) return;

    setEditingContact(prev => ({
      ...prev!,
      [field]: value,
    }));

    // Clear error for this field
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
        <Typography variant="h6">{t('contact.manager.title')}</Typography>
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
                          {getContactTypeLabel(contact.contact_type)}
                        </Typography>
                        <Typography variant="body1">
                          {contact.contact_value}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {contact.is_default && (
                        <Chip label={t('contact.default')} size="small" color="primary" />
                      )}
                      {contact.is_primary && (
                        <Chip label={t('contact.primary')} size="small" color="secondary" />
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
      </Box>

      {/* Add/Edit Form */}
      {editingContact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Card variant="outlined" sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isAdding ? t('contact.manager.addContact') : t('contact.manager.editContact')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth error={!!errors.contact_type}>
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
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingContact.is_primary}
                        onChange={(e) => handleFieldChange('is_primary', e.target.checked)}
                      />
                    }
                    label={t('contact.primary')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingContact.is_default}
                        onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                      />
                    }
                    label={t('contact.default')}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveContact}
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

export default ContactManager;
