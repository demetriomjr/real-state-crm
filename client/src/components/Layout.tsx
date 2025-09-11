import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
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
      // Remove overflow to let pages handle their own scrolling
      overflow: 'visible'
    }}>
      <Header onMenuClick={handleMenuClick} sidebarOpen={sidebarOpen} />

      <Box sx={{
        display: 'flex',
        flex: 1,
        // Remove overflow to let pages handle scrolling
        overflow: 'visible',
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
            mt: '64px',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            display: 'flex',
            flexDirection: 'column',
            // Remove overflow to let pages handle their own scrolling
            overflow: 'visible',
            // Ensure the page takes full available height
            height: 'calc(100vh - 64px)', // viewport height minus header height
            minHeight: 0
          }}
        >
          <Box sx={{
            flex: 1,
            // Remove overflow - pages will handle their own scrolling
            overflow: 'visible',
            background: 'linear-gradient(180deg, rgba(245, 243, 240, 0.8) 0%, rgba(232, 228, 221, 0.6) 50%, rgba(215, 211, 191, 0.4) 100%)',
            minHeight: 0,
            // Let pages control their own height and scrolling
            '& > *': {
              height: '100%',
              minHeight: 0
            }
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
                  minHeight: 0
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
