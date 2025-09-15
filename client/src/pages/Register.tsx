import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Link,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLoading } from '../hooks/useLoading';
import { handleError } from '../utils/errorHandler';
import type { User } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import { useUsernameValidation } from '../hooks/useUsernameValidation';
import { useFormValidation, commonValidationRules } from '../hooks/useFormValidation';
import PasswordInput from '../components/PasswordInput';
import SuccessModal from '../components/SuccessModal';
import FormContainer from '../components/FormContainer';
import PhoneInput from '../components/PhoneInput';
import apiService from '../services/api';
interface RegisterFormData {
  company_name: string;
  master_user_fullName: string;
  master_user_username: string;
  master_user_password: string;
  confirmPassword: string;
  master_user_email?: string;
  master_user_phone?: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { updateAuthData } = useAuth();
  const { 
    isValidating, 
    isAvailable, 
    message, 
    validateUsername
  } = useUsernameValidation();
  
  const validationRules = {
    company_name: commonValidationRules.companyName,
    master_user_fullName: commonValidationRules.humanName,
    master_user_username: commonValidationRules.username,
    master_user_password: commonValidationRules.password,
    master_user_email: commonValidationRules.email,
    master_user_phone: commonValidationRules.phone,
  };
  
  const {
    validateForm: validateFormFields,
    validateSingleField,
    getFieldError,
    clearError,
  } = useFormValidation(validationRules);
  const [formData, setFormData] = useState<RegisterFormData>({
    company_name: '',
    master_user_fullName: '',
    master_user_username: '',
    master_user_password: '',
    confirmPassword: '',
    master_user_email: '',
    master_user_phone: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle username field - only allow letters and numbers, no spaces, convert to lowercase
    if (name === 'master_user_username') {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue,
      }));
      
      // Validate the field
      validateSingleField(name, sanitizedValue);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      
      // Validate the field
      validateSingleField(name, value);
    }
    
    if (error) setError('');
    if (success) setSuccess('');
    
    // Clear field error when user starts typing
    clearError(name);
    
    // Trigger username validation when username field changes
    if (name === 'master_user_username') {
      validateUsername(value);
    }
  };

  const validateForm = (): boolean => {
    // Use the form validation hook
    const isFormValid = validateFormFields(formData as unknown as { [key: string]: string });
    
    // Additional custom validations
    if (formData.master_user_password !== formData.confirmPassword) {
      setError(t('auth.register.passwordsNotMatch'));
      return false;
    }
    
    if (isAvailable === false) {
      setError(t('auth.register.usernameNotAvailable'));
      return false;
    }
    
    if (isValidating) {
      setError(t('auth.register.validatingUsername'));
      return false;
    }
    
    return isFormValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true, t('auth.register.creatingAccount'));
    setError('');
    setSuccess('');

    try {
      const { confirmPassword, ...businessData } = formData;
      // confirmPassword is used for validation but not sent to server
      void confirmPassword;
      
      // Filter out empty optional fields
      const filteredData = {
        ...businessData,
        master_user_email: businessData.master_user_email || undefined,
        master_user_phone: businessData.master_user_phone || undefined,
      };
      
      const response = await apiService.post<{token: string, userSecret: string, expires_at: string, user: unknown}>('/businesses', filteredData);
      
      // Update authentication data in context
      updateAuthData(response.token, response.userSecret, response.expires_at, response.user as User);
      
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const errorMessage = handleError(
        err,
        1, // Default user level for registration
        undefined, // No redirect needed for registration errors
        (message, type) => {
          if (type === 'error') {
            toast.error(message);
          } else {
            toast.warning(message);
          }
        }
      );
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #6B5B4F 0%, #8B7D6B 25%, #A59D84 50%, #C1BAA1 75%, #D7D3BF 100%)',
        padding: { xs: 1, sm: 2 },
        boxSizing: 'border-box',
      }}
    >
      {/* Main content area - centered */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      <FormContainer
        title={t('auth.register.title')}
        subtitle={t('auth.register.subtitle')}
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

              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    required
                    fullWidth
                    id="company_name"
                    label={t('auth.register.companyName')}
                    name="company_name"
                    autoComplete="organization"
                    value={formData.company_name}
                    onChange={handleChange}
                    disabled={false}
                    error={!!getFieldError('company_name')}
                    helperText={getFieldError('company_name')}
                  />
                  <TextField
                    required
                    fullWidth
                    id="master_user_fullName"
                    label={t('auth.register.fullName')}
                    name="master_user_fullName"
                    autoComplete="name"
                    value={formData.master_user_fullName}
                    onChange={handleChange}
                    disabled={false}
                    error={!!getFieldError('master_user_fullName')}
                    helperText={getFieldError('master_user_fullName')}
                  />
                  <TextField
                    required
                    fullWidth
                    id="master_user_username"
                    label={t('auth.register.username')}
                    name="master_user_username"
                    autoComplete="username"
                    value={formData.master_user_username}
                    onChange={handleChange}
                    disabled={false}
                    error={isAvailable === false || !!getFieldError('master_user_username')}
                    helperText={
                      getFieldError('master_user_username') ||
                      (isValidating 
                        ? t('auth.register.checkingUsername')
                        : isAvailable === false 
                          ? message || t('auth.register.usernameNotAvailable')
                          : isAvailable === true 
                            ? message || t('auth.register.usernameAvailable')
                            : '')
                    }
                    inputProps={{
                      pattern: '[a-zA-Z0-9]*',
                      autoComplete: "username",
                      spellCheck: false,
                      autoCorrect: "off",
                      autoCapitalize: "off"
                    }}
                    InputProps={{
                      endAdornment: isValidating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              border: '2px solid #f3f3f3',
                              borderTop: '2px solid #2E7D32',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                              },
                            }}
                          />
                        </Box>
                      ) : isAvailable === true ? (
                        <Box sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                      ) : isAvailable === false ? (
                        <Box sx={{ color: 'error.main', mr: 1 }}>✗</Box>
                      ) : null,
                    }}
                  />
                  <Box sx={{ display: { xs: 'block', sm: 'flex' }, gap: 2 }}>
                              <PasswordInput
                                required
                                fullWidth
                                name="master_user_password"
                                label={t('auth.register.password')}
                                id="master_user_password"
                                autoComplete="new-password"
                                value={formData.master_user_password}
                                onChange={handleChange}
                                disabled={false}
                              />
                    <PasswordInput
                      required
                      fullWidth
                      name="confirmPassword"
                      label={t('auth.register.confirmPassword')}
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={false}
                    />
                  </Box>
                </Box>
                
                {/* Contact Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    id="master_user_email"
                    label={t('auth.register.email')}
                    name="master_user_email"
                    type="email"
                    autoComplete="email"
                    value={formData.master_user_email || ''}
                    onChange={handleChange}
                    error={!!getFieldError('master_user_email')}
                    helperText={getFieldError('master_user_email') || ''}
                    inputProps={{
                      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
                    }}
                  />
                  
                  <PhoneInput
                    id="master_user_phone"
                    label={t('auth.register.phone')}
                    name="master_user_phone"
                    autoComplete="tel"
                    value={formData.master_user_phone || ''}
                    onChange={(value) => handleChange({ target: { name: 'master_user_phone', value } } as React.ChangeEvent<HTMLInputElement>)}
                    error={!!getFieldError('master_user_phone')}
                    helperText={getFieldError('master_user_phone') || ''}
                    placeholder="(11) 1111-1111"
                  />
                </Box>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {t('auth.register.createAccount')}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    {t('auth.register.hasAccount')}
                  </Link>
                </Box>
              </Box>
      </FormContainer>
      </Box>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          paddingTop: '2rem',
          paddingBottom: '1rem',
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.875rem',
          }}
        >
          {t('footer.developedBy')}{' '}
          <Box
            component="a"
            href="https://github.com/demetriomjr"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
                color: 'white',
              },
            }}
          >
            {t('footer.developer')}
          </Box>
          {' • '}
          {t('footer.allRightsReserved')}
        </Typography>
      </motion.div>
      
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={t('auth.register.successTitle')}
        message={t('auth.register.successMessage')}
        buttonText={t('auth.register.continue')}
      />
    </Box>
  );
};

export default Register;