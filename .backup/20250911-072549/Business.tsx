import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  Description as DocumentIcon,
  LocationOn as AddressIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLoading } from '../hooks/useLoading';
import { handleError } from '../utils/errorHandler';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/PageHeader';
import ContactManager from '../components/ContactManager';
import DocumentManager from '../components/DocumentManager';
import AddressManager from '../components/AddressManager';
import EditPageButtonPanel from '../components/EditPageButtonPanel';
import apiService from '../services/api';

interface Contact {
  id?: string;
  contact_type: "email" | "phone" | "whatsapp" | "cellphone";
  contact_value: string;
  person_id: string;
  is_primary: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

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

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  person_id: string;
  is_primary: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface User {
  id: string;
  fullName: string;
  username: string;
  user_level: number;
  tenant_id: string;
  person_id: string;
  person: {
    id: string;
    full_name: string;
    tenant_id: string;
    contacts: Contact[];
    documents: Document[];
    addresses: Address[];
    created_at: string;
    updated_at: string;
  };
}

interface BusinessData {
  id: string;
  company_name: string;
  subscription_level: string;
  created_at: string;
  // Flattened Person data
  full_name: string;
  users: User[];
}

interface BusinessFormData {
  company_name: string;
  full_name: string;
}

const Business: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { user } = useAuth();
  
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [formData, setFormData] = useState<BusinessFormData>({
    company_name: '',
    full_name: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get the master user (user with highest level)
  const masterUser = businessData?.users?.find(user => user.user_level === 9) || businessData?.users?.[0];
  const masterPerson = masterUser?.person;

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true, t('business.loading'));
      const response = await apiService.get<BusinessData>('/businesses/me');
      setBusinessData(response);
      setFormData({
        company_name: response.company_name,
        full_name: response.full_name,
      });
    } catch (err: any) {
      const errorMessage = handleError(
        err,
        user?.user_level || 1,
        () => {
          // Redirect to login handled by error handler
          window.location.href = '/login';
        },
        (message, type) => {
          if (type === 'error') {
            toast.error(message);
          } else {
            toast.warning(message);
          }
        }
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'subscription') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setHasChanges(true);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.company_name.trim()) {
      setError(t('business.companyNameRequired'));
      return false;
    }
    if (!formData.full_name.trim()) {
      setError(t('person.fullNameRequired'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.put<BusinessData>('/businesses/me', formData);
      setBusinessData(response);
      setHasChanges(false);
      setSuccess(t('business.updateSuccess'));
      toast.success(t('business.updateSuccess'));
    } catch (err: any) {
      const errorMessage = handleError(
        err,
        user?.user_level || 1,
        () => {
          // Redirect to login handled by error handler
          window.location.href = '/login';
        },
        (message, type) => {
          if (type === 'error') {
            toast.error(message);
          } else {
            toast.warning(message);
          }
        }
      );
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (businessData) {
      setFormData({
        company_name: businessData.company_name,
        full_name: businessData.full_name,
      });
    }
    setHasChanges(false);
    setError('');
    setSuccess('');
  };

  const handleContactsChange = (contacts: Contact[]) => {
    if (businessData && masterPerson) {
      setBusinessData(prev => ({
        ...prev!,
        users: prev!.users.map(user => 
          user.id === masterUser?.id 
            ? {
                ...user,
                person: {
                  ...user.person,
                  contacts: contacts
                }
              }
            : user
        )
      }));
    }
  };

  const handleDocumentsChange = (documents: Document[]) => {
    if (businessData && masterPerson) {
      setBusinessData(prev => ({
        ...prev!,
        users: prev!.users.map(user => 
          user.id === masterUser?.id 
            ? {
                ...user,
                person: {
                  ...user.person,
                  documents: documents
                }
              }
            : user
        )
      }));
    }
  };

  const handleAddressesChange = (addresses: Address[]) => {
    if (businessData && masterPerson) {
      setBusinessData(prev => ({
        ...prev!,
        users: prev!.users.map(user => 
          user.id === masterUser?.id 
            ? {
                ...user,
                person: {
                  ...user.person,
                  addresses: addresses
                }
              }
            : user
        )
      }));
    }
  };


  const getSubscriptionLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'premium': return t('business.subscriptionLevels.premium');
      case 'standard': return t('business.subscriptionLevels.standard');
      default: return t('business.subscriptionLevels.basic');
    }
  };

  if (!businessData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">{t('business.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageHeader
            title={t('business.title')}
            subtitle={t('business.subtitle')}
          />
        </motion.div>
      </Box>

      {/* Main Content - Scrollable */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 3, 
        pt: 0,
        pb: 0, // Remove bottom padding to prevent double scrollbar
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#a8a8a8',
        },
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Business Information Card - Integrated with Person Data */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  {t('business.information')}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Company Name */}
                <TextField
                  fullWidth
                  label={t('business.companyName')}
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  variant="outlined"
                />
                
                {/* Full Name - Editable */}
                <TextField
                  fullWidth
                  label={t('person.fullName')}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Box>

              {/* Business Status - Read-only Information */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2,
                mt: 3,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1
              }}>
                <TextField
                  fullWidth
                  label={t('business.subscriptionLevel')}
                  value={getSubscriptionLevelText(businessData.subscription_level)}
                  disabled
                  variant="filled"
                />
                <TextField
                  fullWidth
                  label={t('business.dateOfCreation')}
                  value={new Date(businessData.created_at).toLocaleDateString()}
                  disabled
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Tabs for Sub-entities */}
          <Card>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                icon={<ContactIcon />}
                label={t('business.tabs.contacts')}
                iconPosition="start"
              />
              <Tab
                icon={<DocumentIcon />}
                label={t('business.tabs.documents')}
                iconPosition="start"
              />
              <Tab
                icon={<AddressIcon />}
                label={t('business.tabs.addresses')}
                iconPosition="start"
              />
            </Tabs>

            <CardContent>
              {/* Tab Content */}
              {activeTab === 0 && masterPerson && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactManager
                    contacts={masterPerson.contacts}
                    personId={masterPerson.id}
                    onContactsChange={handleContactsChange}
                    disabled={false}
                  />
                </motion.div>
              )}

              {activeTab === 1 && masterPerson && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DocumentManager
                    documents={masterPerson.documents}
                    personId={masterPerson.id}
                    onDocumentsChange={handleDocumentsChange}
                    disabled={false}
                  />
                </motion.div>
              )}

              {activeTab === 2 && masterPerson && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AddressManager
                    addresses={masterPerson.addresses}
                    personId={masterPerson.id}
                    onAddressesChange={handleAddressesChange}
                    disabled={false}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Fixed Bottom Action Buttons */}
      <EditPageButtonPanel
        hasChanges={hasChanges}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        savingText={t('business.saving')}
      />
    </Box>
  );
};

export default Business;