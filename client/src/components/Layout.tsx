import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden' // Prevent any unwanted scrollbars
    }}>
      <Header onMenuClick={handleMenuClick} sidebarOpen={sidebarOpen} />

      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0
      }}>
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: {
              md: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)',
              xs: '100%'
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0
          }}
        >
          {/* Content area with gradient background */}
          <Box sx={{
            flex: 1,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(245, 243, 240, 0.8) 0%, rgba(232, 228, 221, 0.6) 50%, rgba(215, 211, 191, 0.4) 100%)',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={window.location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    minHeight: '100%'
                  }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              flexShrink: 0,
              backgroundColor: 'background.paper',
              px: { xs: 2, sm: 3 },
              py: 1,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
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
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('footer.developer')}
                </Box>
                {' • '}
                {t('footer.allRightsReserved')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
