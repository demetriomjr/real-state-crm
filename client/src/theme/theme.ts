import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B7D6B', // Darker brown primary
      light: '#A59D84',
      dark: '#6B5B4F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C1BAA1', // Medium beige secondary
      light: '#D7D3BF',
      dark: '#A59D84',
      contrastText: '#2C3E50',
    },
    background: {
      default: '#F5F3F0', // Very light warm background
      paper: '#D7D3BF', // Darker beige for cards
    },
    text: {
      primary: '#3C2F2A', // Dark brown text
      secondary: '#6B5B4F', // Medium brown
    },
    success: {
      main: '#6B5B4F', // Dark brown instead of green
      light: '#8B7D6B',
      dark: '#4A3F3A',
    },
    error: {
      main: '#B85450', // Warm red that works with brown
      light: '#D67B77',
      dark: '#9A3F3B',
    },
    warning: {
      main: '#D4A574', // Warm amber that works with brown
      light: '#E6C299',
      dark: '#B8935F',
    },
    info: {
      main: '#8B7D6B', // Brown info color
      light: '#A59D84',
      dark: '#6B5B4F',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
        contained: {
          backgroundColor: '#8B7D6B',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#6B5B4F',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
          '&:focus': {
            outline: 'none',
          },
        },
        outlined: {
          borderColor: '#8B7D6B',
          color: '#8B7D6B',
          '&:hover': {
            borderColor: '#6B5B4F',
            backgroundColor: 'rgba(139, 125, 107, 0.08)',
          },
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F5F3F0',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8B7D6B',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6B5B4F',
              borderWidth: 2,
            },
            '&:focus': {
              outline: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6B5B4F',
            '&.Mui-focused': {
              color: '#6B5B4F',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backgroundColor: '#E8E4DD', // Subtle beige background
          border: '1px solid rgba(139, 125, 107, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backgroundColor: '#E8E4DD', // Subtle beige background
          border: '1px solid rgba(139, 125, 107, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0, // Remove rounded corners from drawer
          borderRight: 'none', // Remove border completely
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 0,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
