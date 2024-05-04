import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Flax from "../images/FlaxSmall.png"

const BalanceHeader = () => {
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Grid item style={{ marginBottom: '12px' }}>
                <Typography variant="h5" style={{ color: '#DAA520' }}>
                    Balance
                </Typography>
            </Grid>
            <Grid item style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <Box component="img" src={Flax} alt="Balance Icon" sx={{ height: '40px', width: '40px', marginRight: '10px' }} />
                <Typography variant="h2">
                    0.0000
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h5" style={{ color: '#00A36C' }}>
                    $0.00
                </Typography>
            </Grid>
        </Grid>
    );
};

export default BalanceHeader;
