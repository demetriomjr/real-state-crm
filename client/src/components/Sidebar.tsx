import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { text: t('navigation.home'), icon: <HomeIcon />, path: '/' },
    { text: t('navigation.leads'), icon: <AssessmentIcon />, path: '/leads' },
    { text: t('navigation.customers'), icon: <PeopleIcon />, path: '/customers' },
    { text: t('navigation.chat'), icon: <ChatIcon />, path: '/chat' },
  ];

  const bottomMenuItems = [
    { text: 'My business', icon: <BusinessIcon />, path: '/business' },
    { text: t('navigation.settings'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      minWidth: 0
    }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        {open ? (
          <Typography variant="h6" color="primary" fontWeight="bold">
            {t('app.name')}
          </Typography>
        ) : (
          <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
            FS
          </Typography>
        )}
      </Box>
      <Divider />
      
      {/* Main menu items */}
      <List sx={{ flex: 1, overflow: 'hidden' }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 125, 107, 0.25)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 125, 107, 0.35)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(139, 125, 107, 0.15)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'inherit',
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    color: 'inherit',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      
      {/* Bottom menu items */}
      <List sx={{ overflow: 'hidden' }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 125, 107, 0.25)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 125, 107, 0.35)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(139, 125, 107, 0.15)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'inherit',
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    color: 'inherit',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={isMobile ? open : true} // Always open on desktop
      onClose={onClose}
      sx={{
        width: open ? 280 : (isMobile ? 0 : 64),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : (isMobile ? 280 : 64),
          boxSizing: 'border-box',
          position: 'relative',
          height: '100vh',
          backgroundColor: '#A59D84',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
