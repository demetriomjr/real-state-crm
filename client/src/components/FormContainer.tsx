import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

interface FormContainerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  icon,
  children,
  maxWidth = 500,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        maxWidth: maxWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card 
        sx={{ 
          width: '100%', 
          maxWidth: maxWidth,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {icon && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                {icon}
              </Box>
            )}
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FormContainer;
