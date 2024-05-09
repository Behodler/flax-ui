import React from 'react';
import { TextField, InputAdornment, Button, Box } from '@mui/material';

const IconTextBox = (props: { cornerImage: JSX.Element }) => {
  return (
    <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'end', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: '20px', left: '0' }}>
        {props.cornerImage}
      </Box>
      <TextField
        variant="standard"
        fullWidth
        placeholder="Type here..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* Transparent placeholder to offset text properly */}
              <div style={{ width: 40, height: 40 }} />
            </InputAdornment>
          ),
          sx: {
            paddingLeft: '10px', // Space to prevent text overlap with the image
            '& input': {
              textAlign: 'right' // Align text to the right
            }
          }
        }}
        sx={{
          '& .MuiInput-underline:before': {
            borderBottomColor: 'rgba(0, 0, 0, 0.42)', // Default underline color
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'rgba(0, 0, 0, 0.87)', // Hover underline color
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'primary.main', // Focused underline color
          },
          '& .MuiInput-input': {
            height: '1.1876em' // Adjust the height to match your design needs
          },
          marginTop: '40px', // Adjusting the top margin to accommodate the image
          height: '50px' // Adjusting field height for proper visual balance
        }}
      />
      <Button size="small" sx={{ minWidth: 'auto', padding: 0, marginTop: '8px', fontSize: '0.75rem' }}>MAX</Button>
    </Box>
  );
};

export default IconTextBox;
