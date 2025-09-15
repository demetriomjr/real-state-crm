import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { handleError } from '../utils/errorHandler';
import PasswordInput from '../components/PasswordInput';
import type { LoginRequest } from '../types/auth';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true, t('auth.login.signingIn'));
    setError('');

    try {
      await authLogin(formData);
      toast.success(t('auth.login.loginSuccess'));
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = handleError(
        err,
        1, // Default user level - actual level validated server-side
        undefined, // No redirect needed for login errors
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 450,
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {t('auth.login.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.login.subtitle')}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label={t('auth.login.username')}
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  disabled={false}
                  helperText={t('auth.login.usernameHelp')}
                  placeholder="username"
                  inputProps={{
                    autoComplete: "username",
                    spellCheck: false,
                    autoCorrect: "off",
                    autoCapitalize: "off"
                  }}
                />
                  <PasswordInput
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t('auth.login.password')}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={false}
                  />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {t('auth.login.signIn')}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    {t('auth.login.noAccount')}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
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
    </Box>
  );
};

export default Login;
