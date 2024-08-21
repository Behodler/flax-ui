import React, { useEffect, useState } from 'react';
import './App.css';
import { Contracts, useBlockchainContext } from './contexts/BlockchainContextProvider';
import useCoupon from './hooks/useCoupon';
import { TransactionState, useContractFunction, useEthers } from '@usedapp/core';
import { Contract, ContractTransaction } from 'ethers';
import { ControlCamera } from '@mui/icons-material';
import { Broadcast, TransactionProgress } from './extensions/Broadcast';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import MinterPage from './components/MinterPage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Grid } from '@mui/material';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div style={{ overflowX: 'hidden', backgroundColor: '#0D131A' }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
       
        >
          <Grid item sx={{ margin: "20px" }}>
            
            <ConnectButton />
          </Grid>
        </Grid>

        <MinterPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
