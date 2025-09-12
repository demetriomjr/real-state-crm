import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        backgroundColor: '#C1BAA1',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('footer.developedBy')}{' '}
        <Link
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
        </Link>
        {' • '}
        {t('footer.allRightsReserved')}
      </Typography>
    </Box>
  );
};

export default Footer;
