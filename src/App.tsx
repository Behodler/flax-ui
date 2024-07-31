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

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div style={{ overflowX: 'hidden' }}>
        <MinterPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
