import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0A0A0A',
      light: '#262626',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#171717',
      light: '#404040',
      dark: '#0A0A0A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#525252',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:focus-visible': {
            outline: '2px solid #6366f1',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
          },
        },
        contained: {
          backgroundColor: '#0A0A0A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#262626',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#0A0A0A',
          '&:hover': {
            borderColor: '#0A0A0A',
            backgroundColor: '#F5F5F5',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: '#E5E7EB',
          },
          '&:hover fieldset': {
            borderColor: '#A3A3A3',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6366f1',
            borderWidth: '2px',
          },
        },
      },
    },
  },
});

export default theme;
