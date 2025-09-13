import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Person,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserDataClick = () => {
    handleMenuClose();
    navigate('/my-data');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#C1BAA1',
        color: 'text.primary',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ 
            mr: 2,
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          {t('app.name')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {user?.fullName || 'User'}
          </Typography>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ color: 'text.primary' }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {user?.fullName ? getInitials(user.fullName) : <AccountCircle />}
            </Avatar>
          </IconButton>
        </Box>

         <Menu
           anchorEl={anchorEl}
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'right',
           }}
           keepMounted
           transformOrigin={{
             vertical: 'top',
             horizontal: 'right',
           }}
           open={Boolean(anchorEl)}
           onClose={handleMenuClose}
         >
           <MenuItem onClick={handleUserDataClick}>
             <Person sx={{ mr: 1 }} />
             {t('header.userMenu.userData')}
           </MenuItem>
           <MenuItem onClick={handleLogout}>
             <Logout sx={{ mr: 1 }} />
             {t('header.userMenu.logout')}
           </MenuItem>
         </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
