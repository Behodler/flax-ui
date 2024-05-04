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
    h6: { // Assuming h6 for header text based on size
      fontWeight: 500,
      fontSize: '11px',
      lineHeight: '16px',
      color: 'rgb(122, 138, 153)',
    },
    body1: { // Assuming body1 for main content text
      fontWeight: 400,
      fontSize: '15px',
      lineHeight: '20px',
    },
    subtitle1: { // Assuming subtitle1 for subtext
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
      color: 'rgb(122, 138, 153)',
    },
    h2: { // Assuming subtitle1 for subtext
      fontWeight: 400,
      fontSize: '35px',
      lineHeight: '40px',
      color: 'white',
    },
    h5:{
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '20px',
      color: 'white',
    }
  },
});

export default theme;
