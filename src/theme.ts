import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#0D131A', // Main background color
      paper: '#1D2833',   // Background for elements like cards, dialogs
    },
    text: {
      primary: 'rgb(255, 255, 255)',       // Primary text color
      secondary: 'rgb(122, 138, 153)',     // Secondary text color for headers and subtexts
    },
    action: {
      active: '#273340',  // Button background color and possibly other interactive elements
    },
  },
  typography: {
    fontFamily: '"Haas Grot Text R", "Arial", sans-serif',
    allVariants: {
      color: 'rgb(255, 255, 255)',
    },
    h6: {
      fontWeight: 500,
      fontSize: '11px',
      lineHeight: '16px',
      color: 'rgb(122, 138, 153)',
    },
    body1: {
      fontWeight: 400,
      fontSize: '15px',
      lineHeight: '20px',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
      color: 'rgb(122, 138, 153)',
    },
    h2: {
      fontWeight: 400,
      fontSize: '35px',
      lineHeight: '40px',
      color: 'white',
    },
    h3: {
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '16px',
      color: 'rgb(142, 158, 173)',
    },
    h5: {
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '20px',
      color: 'white',
    },
    h4: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '20px',
      color: 'white',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      }
    }, MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '14px', // Sets the font size for all tooltips
        },
      }
    }
  }
});

export default theme;
