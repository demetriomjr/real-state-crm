import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  Description as DocumentIcon,
  LocationOn as AddressIcon,
  Lock as PasswordIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useLoading } from '../hooks/useLoading';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import EditPageButtonPanel from '../components/EditPageButtonPanel';
import ContactManager from '../components/ContactManager';
import DocumentManager from '../components/DocumentManager';
import AddressManager from '../components/AddressManager';
import PasswordChangeModal from '../components/PasswordChangeModal';
import LoginHistoryGrid from '../components/LoginHistoryGrid';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  contacts: Contact[];
  documents: Document[];
  addresses: Address[];
  logs?: LoginLog[];
  created_at?: Date;
  updated_at?: Date;
  // Note: user_level and roles removed for security - these are validated server-side only
}

interface LoginLog {
  id: string;
  login_at: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
}

interface Contact {
  id?: string;
  contact_type: "email" | "phone" | "cellphone";
  contact_value: string;
  is_default?: boolean;
}

interface Document {
  id?: string;
  document_type: "cpf" | "cnpj" | "rg" | "passport" | "driver_license";
  document_number: string;
  is_default?: boolean;
}

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

const UserEdit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { setLoading } = useLoading();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    contacts: [] as Contact[],
    documents: [] as Document[],
    addresses: [] as Address[],
    // Note: user_level removed for security - not editable by users
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const hasLoadedData = useRef(false);

  useEffect(() => {
    // Only fetch data once when currentUser is available and we haven't loaded yet
    if (currentUser && !hasLoadedData.current) {
      hasLoadedData.current = true;
      
      const fetchUserData = async () => {
        try {
          setLoading(true, 'Carregando dados do usuário...');
          
          // Fetch user profile with person data and logs from API using RESTful pattern
          const userProfile = await apiService.getCurrentUserProfileWithLogs();
          
          // Create a user object that matches our interface (person data is embedded)
          const userWithEmbeddedData: UserProfile = {
            id: userProfile.id,
            username: userProfile.username || '',
            full_name: userProfile.full_name || '',
            contacts: (userProfile.contacts || []) as Contact[],
            documents: (userProfile.documents || []) as Document[],
            addresses: userProfile.addresses || [],
            logs: userProfile.logs || [],
            // Note: user_level removed for security
          };
          
          setUser(userWithEmbeddedData);
          setFormData({
            username: userProfile.username || '',
            full_name: userProfile.full_name || '',
            contacts: userProfile.contacts || [],
            documents: userProfile.documents || [],
            addresses: userProfile.addresses || [],
            // Note: user_level removed for security
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Erro ao carregar dados do usuário');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [currentUser]); // Only depend on currentUser

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = t('user.validation.usernameRequired');
    }

    // Validate full_name
    if (!formData.full_name.trim()) {
      newErrors.full_name = t('user.validation.fullNameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };


  const handleSave = async () => {
    if (!validateForm()) {
      toast.error(t('user.validationError'));
      return;
    }

    try {
      setSaving(true);
      
      // Clean data before sending (remove audit fields)
      const cleanContacts = formData.contacts.map(contact => ({
        id: contact.id,
        contact_type: contact.contact_type,
        contact_value: contact.contact_value,
        is_default: contact.is_default,
      }));

      const cleanDocuments = formData.documents.map(document => ({
        id: document.id,
        document_type: document.document_type,
        document_number: document.document_number,
        is_default: document.is_default,
      }));

      const cleanAddresses = formData.addresses.map(address => ({
        id: address.id,
        street: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      }));

      // Update user profile via API - this now returns new authentication data
      const authResponse = await apiService.updateCurrentUserProfile({
        username: formData.username,
        full_name: formData.full_name,
        contacts: cleanContacts,
        documents: cleanDocuments,
        addresses: cleanAddresses,
      });

      // Update authentication data in localStorage (token, userSecret, user data)
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('userSecret', authResponse.userSecret);
      
      // Create secure user object for localStorage (no sensitive data)
      const secureUser = {
        id: authResponse.userId,
        fullName: authResponse.userFullName,
        // Note: username, user_level, and roles removed for security
      };
      localStorage.setItem('user', JSON.stringify(secureUser));
      localStorage.setItem('expires_at', authResponse.expires_at.toString());

      // Update local user state with the new user data from auth response
      const updatedUser: UserProfile = {
        id: authResponse.userId,
        username: formData.username, // Keep the updated username
        full_name: authResponse.userFullName, // Use userFullName from auth response
        contacts: user?.contacts || [], // Keep existing contacts
        documents: user?.documents || [], // Keep existing documents
        addresses: user?.addresses || [], // Keep existing addresses
        created_at: user?.created_at,
        updated_at: user?.updated_at,
        // Note: user_level removed for security
      };

      setUser(updatedUser);
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error(t('user.error.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleContactsChange = (contacts: Contact[]) => {
    if (user) {
      setUser({
        ...user,
        contacts,
      });
      setFormData(prev => ({
        ...prev,
        contacts,
      }));
    }
  };

  const handleDocumentsChange = (documents: Document[]) => {
    if (user) {
      setUser({
        ...user,
        documents,
      });
      setFormData(prev => ({
        ...prev,
        documents,
      }));
    }
  };

  const handleAddressesChange = (addresses: Address[]) => {
    if (user) {
      setUser({
        ...user,
        addresses,
      });
      setFormData(prev => ({
        ...prev,
        addresses,
      }));
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      setPasswordLoading(true);
      
      // Validate password change
      const response = await apiService.validatePasswordChange({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      // Update user password in the backend
      await apiService.put(`/users/${user?.id}`, {
        password: response.encryptedPassword,
      });

      toast.success(t('password.change.success'));
      setShowPasswordModal(false);
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('password.change.error');
      toast.error(errorMessage);
      throw error;
    } finally {
      setPasswordLoading(false);
    }
  };


  if (!user) {
    return null;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      minHeight: '100%'
    }}>
      {/* Content Container */}
      <Box sx={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        minHeight: 0
      }}>
        {/* Content Wrapper */}
        <Box sx={{
          maxWidth: { xs: '100%', md: 1200 },
          mx: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          {/* Page Title */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            py: 2
          }}>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              <PersonIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }} />
              {t('user.title')}
            </Typography>
          </Box>

          {/* Information Cards Section */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1.875,
            py: 2
          }}>
            {/* Left: Main Information */}
            <Card sx={{ flex: { md: '2 1 0%' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {t('user.information')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label={t('user.username')}
                    value={formData.username}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                    disabled={true} // Username is not editable by users for security
                  />
                  
                  <TextField
                    fullWidth
                    label={t('user.fullName')}
                    value={formData.full_name}
                    onChange={(e) => handleFieldChange('full_name', e.target.value)}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Right: Status/Additional Info */}
            <Card sx={{ flex: { md: '1 1 0%' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {t('user.status')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* User level field removed for security - not editable by users */}
                  <Typography variant="body2" color="text.secondary">
                    {t('user.securityNote')}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<PasswordIcon />}
                    onClick={() => setShowPasswordModal(true)}
                    fullWidth
                    sx={{ 
                      color: 'error.main',
                      borderColor: 'error.main',
                      '&:hover': {
                        borderColor: 'error.dark',
                        backgroundColor: 'error.light',
                        color: 'error.dark'
                      }
                    }}
                  >
                    {t('password.change.title')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    onClick={() => {/* TODO: Implement role editing */}}
                    fullWidth
                    disabled={true} // Always disabled for logged user editing own profile
                    sx={{ 
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      mt: 1,
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.light',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    {t('user.editRoles')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Tabs Section for Lists */}
          {user && (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              py: 2
            }}>
              <Card sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    icon={<ContactIcon />}
                    label={t('user.tabs.contacts')}
                    iconPosition="start"
                  />
                  <Tab
                    icon={<DocumentIcon />}
                    label={t('user.tabs.documents')}
                    iconPosition="start"
                  />
                  <Tab
                    icon={<AddressIcon />}
                    label={t('user.tabs.addresses')}
                    iconPosition="start"
                  />
                </Tabs>

                <CardContent sx={{ 
                  pb: 6,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0
                }}>
                  <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                      <motion.div
                        key="contacts"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ContactManager
                          contacts={user?.contacts || []}
                          onContactsChange={handleContactsChange}
                          disabled={false}
                        />
                      </motion.div>
                    )}
                    {activeTab === 1 && (
                      <motion.div
                        key="documents"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DocumentManager
                          documents={user?.documents || []}
                          onDocumentsChange={handleDocumentsChange}
                          disabled={false}
                        />
                      </motion.div>
                    )}
                    {activeTab === 2 && (
                      <motion.div
                        key="addresses"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AddressManager
                          addresses={user?.addresses || []}
                          onAddressesChange={handleAddressesChange}
                          disabled={false}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Login History Section - Inside scrollable area */}
          {user && (
            <Box sx={{
              maxWidth: { xs: '100%', md: 1200 },
              mx: 'auto',
              width: '100%',
              py: 2
            }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {t('user.loginHistory.title')}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <LoginHistoryGrid userId={user?.id || ''} initialLogs={user?.logs} />
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      {/* Button Panel */}
      <Box sx={{
        maxWidth: { xs: '100%', md: 1200 },
        mx: 'auto',
        width: '100%',
        height: 'auto',
        flexShrink: 0,
        py: 2
      }}>
        <EditPageButtonPanel
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          savingText={t('user.saving')}
        />
      </Box>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: 400,
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#4caf50',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {t('user.success')}
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center', pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('user.successMessage')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', pt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSuccessModalClose}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            {t('common.ok')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Modal */}
      <PasswordChangeModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordChange}
        loading={passwordLoading}
      />
    </Box>
  );
};

export default UserEdit;
