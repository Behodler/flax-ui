import React from 'react';
import { Grid, Container, Box } from '@mui/material';

const MinterPage = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={0} sx={{ backgroundColor: '#0D131A', width: '100vw', height: '100vh' }}>  // Ensure full height
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1100, flexBasis: 1100 }}>
          <Box sx={{ height: '100vh', width: '100%', color: 'white', padding: 4, backgroundColor: '#0D131A' }}>
            {/* Main content goes here */}
            <Box sx={{ width: 300, height: 200, backgroundColor: '#1D2833', margin: 'auto', textAlign: 'center', padding: 2 }}>
              Small Floating Item
            </Box>
          </Box>
        </Grid>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
      </Grid>
    </Container>
  );
};

export default MinterPage;
