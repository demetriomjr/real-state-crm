import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Chat as ChatIcon,
  TrendingUp,
  Add,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { 
      title: t('home.stats.totalLeads'), 
      value: '0', 
      icon: <AssessmentIcon />, 
      color: 'primary',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: t('home.stats.customers'), 
      value: '0', 
      icon: <PeopleIcon />, 
      color: 'secondary',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: t('home.stats.ordersAndOffers'), 
      value: '0', 
      icon: <ShoppingCartIcon />, 
      color: 'success',
      change: '+5%',
      trend: 'up'
    },
    { 
      title: t('home.stats.activeChats'), 
      value: '0', 
      icon: <ChatIcon />, 
      color: 'warning',
      change: '+15%',
      trend: 'up'
    },
  ];

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Welcome Section - Fixed at top with inverted gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(245, 243, 240, 0.85) 0%, rgba(232, 228, 221, 0.75) 30%, rgba(215, 211, 191, 0.65) 100%)',
          p: 4,
          opacity: 0.9
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700, 
            color: '#3C2F2A',
            textShadow: '0 1px 2px rgba(255,255,255,0.5)'
          }}>
            {t('home.welcome', { name: user?.fullName || 'User' })}
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            fontWeight: 400,
            color: '#4A3F3A',
            textShadow: '0 1px 2px rgba(255,255,255,0.3)'
          }}>
            {t('home.subtitle')}
          </Typography>
          <Chip 
            icon={<TrendingUp />} 
            label="Sistema ativo" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(60, 47, 42, 0.1)',
              color: '#3C2F2A',
              borderColor: 'rgba(60, 47, 42, 0.2)',
              '& .MuiChip-icon': {
                color: '#3C2F2A',
              }
            }}
            variant="outlined"
          />
        </Box>
      </motion.div>

      {/* Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
        gap: 3,
        overflow: 'auto'
      }}>

      {/* Stats Grid - Responsive */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: { xs: 2, sm: 3 },
        flexShrink: 0,
        width: '100%',
        minHeight: { xs: 120, sm: 140, md: 160 }
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card sx={{
              minHeight: { xs: 120, sm: 140, md: 160 },
              height: '100%',
              background: 'linear-gradient(135deg, rgba(139, 125, 107, 0.08) 0%, rgba(193, 186, 161, 0.04) 100%)',
              border: '1px solid rgba(139, 125, 107, 0.15)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease-in-out',
              }
            }}>
              <CardContent sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                  <Box
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      borderRadius: 3,
                      bgcolor: `${stat.color}.main`,
                      color: `${stat.color}.contrastText`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: 32, sm: 40 },
                      minHeight: { xs: 32, sm: 40 },
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      backgroundColor: 'rgba(107, 91, 79, 0.1)',
                      color: '#6B5B4F',
                      borderColor: '#6B5B4F',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    color={`${stat.color}.main`} 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Main Content Grid - Takes remaining space */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: '1fr', 
          md: '2fr 1fr' 
        }, 
        gap: { xs: 2, sm: 3 },
        flex: 1,
        minHeight: 0,
        width: '100%'
      }}>
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ height: '100%', display: 'flex' }}
        >
          <Card sx={{ 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, rgba(139, 125, 107, 0.08) 0%, rgba(193, 186, 161, 0.04) 100%)',
            border: '1px solid rgba(139, 125, 107, 0.15)',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              background: 'linear-gradient(135deg, rgba(139, 125, 107, 0.12) 0%, rgba(193, 186, 161, 0.08) 100%)',
              border: '1px solid rgba(139, 125, 107, 0.25)',
            }
          }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              flex: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexShrink: 0 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                }}>
                  {t('home.recentActivity')}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#8B7D6B',
                    color: '#6B5B4F',
                    fontWeight: 500,
                    backgroundColor: 'rgba(139, 125, 107, 0.05)',
                    '&:hover': {
                      borderColor: '#6B5B4F',
                      backgroundColor: 'rgba(139, 125, 107, 0.1)',
                      color: '#4A3F3A',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Ver tudo
                </Button>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flex: 1,
                textAlign: 'center'
              }}>
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('home.noActivity')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ height: '100%', display: 'flex' }}
        >
          <Card sx={{ 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, rgba(139, 125, 107, 0.08) 0%, rgba(193, 186, 161, 0.04) 100%)',
            border: '1px solid rgba(139, 125, 107, 0.15)',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              background: 'linear-gradient(135deg, rgba(139, 125, 107, 0.12) 0%, rgba(193, 186, 161, 0.08) 100%)',
              border: '1px solid rgba(139, 125, 107, 0.25)',
            }
          }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              flex: 1
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: 'text.primary', 
                mb: 3, 
                flexShrink: 0,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
              }}>
                {t('home.quickActions')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    background: 'linear-gradient(135deg, #6B5B4F 0%, #8B7D6B 100%)',
                    color: '#F5F3F0',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4A3F3A 0%, #6B5B4F 100%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Novo Lead
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<PeopleIcon />}
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    borderColor: '#8B7D6B',
                    color: '#6B5B4F',
                    fontWeight: 500,
                    backgroundColor: 'rgba(139, 125, 107, 0.05)',
                    '&:hover': {
                      borderColor: '#6B5B4F',
                      backgroundColor: 'rgba(139, 125, 107, 0.1)',
                      color: '#4A3F3A',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Adicionar Cliente
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ChatIcon />}
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    borderColor: '#8B7D6B',
                    color: '#6B5B4F',
                    fontWeight: 500,
                    backgroundColor: 'rgba(139, 125, 107, 0.05)',
                    '&:hover': {
                      borderColor: '#6B5B4F',
                      backgroundColor: 'rgba(139, 125, 107, 0.1)',
                      color: '#4A3F3A',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Iniciar Chat
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
      </Box>
    </Box>
  );
};

export default Home;
