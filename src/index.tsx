// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DAppProvider, Config, Mainnet, Sepolia, Localhost } from '@usedapp/core';
import { BlockchainContextProvider } from './contexts/BlockchainContextProvider';
import { ethers } from 'ethers';
import { ContractAddresses } from './types/ContractAddresses';

const config: Config = {
  networks: [Localhost, Mainnet, Sepolia],  // Including multiple networks,
  multicallVersion: 2 as const,
  multicallAddresses : {
    31337: "0xb0b8c7ccc64be9aa9b5712bbec5a5bd0a3213059"
  }
};



const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <BlockchainContextProvider>
        <App />
      </BlockchainContextProvider>
    </DAppProvider>
  </React.StrictMode>
);