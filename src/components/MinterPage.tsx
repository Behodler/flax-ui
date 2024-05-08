import React from 'react';
import { Grid, Container, Box, Paper } from '@mui/material';
import BalanceHeader
  from './BalanceHeader';
import AssetList from './AssetList';
import MintPanel from './MintPanel';
const MinterPage = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={0} sx={{ backgroundColor: '#0D131A', width: '100vw', minHeight: '100vh', boxSizing: 'border-box' }}>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1170, flexBasis: 1170 }}>
          <Box id="box" sx={{ minHeight: '100%', width: '100%', color: 'white', padding: 4, backgroundColor: '#0D131A', boxSizing: 'border-box' }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item style={{ height: '130px' }}>
                <BalanceHeader />
              </Grid>


              <Grid item >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="top"
                >
                  <Grid item sx={{ width: '640px' }}>
                    <AssetList />
                  </Grid>
                  <Grid item sx={{ width: '440px' }}>
                    <MintPanel />
                  </Grid>
                </Grid>
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
