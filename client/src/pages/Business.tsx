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
import { useAuth, useI18nReady } from '../hooks/useAuth';
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
  // Person-related data (addresses, contacts, documents as Business properties)
  addresses: Address[];
  contacts: Contact[];
  documents: Document[];
  // Keep users for backward compatibility (though not used in new structure)
  users?: User[];
}

interface BusinessFormData {
  company_name: string;
  full_name: string;
}

const Business: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const isI18nReady = useI18nReady();
  
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

  // In the new structure, addresses, contacts, and documents are directly on businessData
  // No need for masterUser/masterPerson logic anymore

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
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
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
    if (businessData) {
      setBusinessData(prev => ({
        ...prev!,
        contacts: contacts
      }));
    }
  };

  const handleDocumentsChange = (documents: Document[]) => {
    if (businessData) {
      setBusinessData(prev => ({
        ...prev!,
        documents: documents
      }));
    }
  };

  const handleAddressesChange = (addresses: Address[]) => {
    if (businessData) {
      setBusinessData(prev => ({
        ...prev!,
        addresses: addresses
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

  // Wait for i18n to be ready before rendering
  if (!isI18nReady) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  if (!businessData) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <Typography variant="h6">{t('business.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      // Ensure proper scrolling for the entire page
      overflow: 'hidden',
      // Set page width and centering - this controls both data container and button panel
      maxWidth: { xs: '100%', md: 1200 },
      mx: 'auto',
      width: '100%'
    }}>
      {/* Header - Now part of scrollable content */}
      <Box sx={{
        p: { xs: 2, sm: 3 },
        pb: { xs: 1, sm: 2 },
        flexShrink: 0,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
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

      {/* Main Content - Scrollable area */}
      <Box sx={{
        flex: 1,
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 }, // Add padding top below header
        pb: 0,
        // Reserve space for the sticky button panel (height + padding)
        paddingBottom: { xs: '100px', sm: '120px' },
        minHeight: 0,
        // Ensure proper scrolling
        overflowY: 'auto',
        // Ensure proper spacing on mobile
        '& .MuiCard-root': {
          mb: { xs: 2, sm: 3 }
        }
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

          {/* Row container: Info (left) and Business Status (right) */}
          <Box sx={{
            width: '100%', // Full width of parent container
            mb: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1, sm: 2 }
          }}>
            {/* Left: Business Information */}
            <Card sx={{ flex: { md: '2 1 0%' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {t('business.information')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label={t('business.companyName')}
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label={t('person.fullName')}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Right: Business Status */}
            <Card sx={{ flex: { md: '1 1 0%' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {t('business.businessStatus')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </Box>

          {/* Tabs for Sub-entities */}
          <Card sx={{
            width: '100%', // Full width of parent container
            mb: { xs: 2, sm: 3 } // Reduce bottom margin to prevent overflow
          }}>
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

            <CardContent sx={{ pb: 6 }}>
              {/* Tab Content */}
              {activeTab === 0 && businessData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactManager
                    contacts={businessData.contacts}
                    personId={businessData.id} // Using business ID as person ID for new structure
                    onContactsChange={handleContactsChange}
                    disabled={false}
                  />
                </motion.div>
              )}

              {activeTab === 1 && businessData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DocumentManager
                    documents={businessData.documents}
                    personId={businessData.id} // Using business ID as person ID for new structure
                    onDocumentsChange={handleDocumentsChange}
                    disabled={false}
                  />
                </motion.div>
              )}

              {activeTab === 2 && businessData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AddressManager
                    addresses={businessData.addresses}
                    personId={businessData.id} // Using business ID as person ID for new structure
                    onAddressesChange={handleAddressesChange}
                    disabled={false}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Fixed Bottom Action Buttons - Centered with page content */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1000,
        // Match page width constraints
        width: { xs: '100%', md: 1200 },
        maxWidth: '100%',
        px: { xs: 2, sm: 3 }
      }}>
        <EditPageButtonPanel
          hasChanges={hasChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          savingText={t('business.saving')}
        />
      </Box>
    </Box>
  );
};

export default Business;