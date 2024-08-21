// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DAppProvider, Config, Mainnet, Sepolia, Localhost, Hardhat } from '@usedapp/core';
import { BlockchainContextProvider } from './contexts/BlockchainContextProvider';
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { config } from './wagmi';

const client = new QueryClient();

const useDappConfig: Config = {
  networks: [Localhost, Mainnet, Sepolia, Hardhat],  // Including multiple networks,
  multicallVersion: 2 as const,
  multicallAddresses: {
    31337: "0xb0b8c7ccc64be9aa9b5712bbec5a5bd0a3213059"
  }
};



const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={client}>
      <RainbowKitProvider theme={darkTheme()}>
        <DAppProvider config={useDappConfig}>
          <BlockchainContextProvider>
            <App />
          </BlockchainContextProvider>
        </DAppProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);