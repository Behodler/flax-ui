import React from 'react';
import { Grid, Container, Box } from '@mui/material';

const MinterPage = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1100, flexBasis: 1100 }}>
          <Box sx={{ background: '#1D2833', height: '100vh', color: 'white', padding: 4 }}>
            {/* Content goes here */}
            Your dApp Content
          </Box>
        </Grid>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
      </Grid>
    </Container>
  );
};

export default MinterPage;
