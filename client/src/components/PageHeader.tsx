import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  children,
}) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ mb: 3 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 2 }}>
            {breadcrumbs.map((item, index) => (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={() => item.path && handleBreadcrumbClick(item.path)}
                sx={{
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main',
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {children && (
            <Box>
              {children}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PageHeader;
