import React from 'react';
import { Grid, Container, Box } from '@mui/material';

const MinterPage = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={0} sx={{ backgroundColor: '#0D131A', width: '100vw', minHeight: '100vh', boxSizing: 'border-box' }}>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1100, flexBasis: 1100 }}>
          <Box id="box" sx={{ minHeight: '100%', width: '100%', color: 'white', padding: 4, backgroundColor: '#0D131A', boxSizing: 'border-box' }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item style={{ height: '152px', border: '1px solid orange', marginBottom: '30px' }}>
              Balance header goes header
              </Grid>
              <Grid item style={{ minHeight: '600px', border: '1px solid orange' }}>
                Asset list and actions go here in a grid
              </Grid>
            </Grid>

          </Box>
        </Grid>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
      </Grid>
    </Container>
  );
};

export default MinterPage;
