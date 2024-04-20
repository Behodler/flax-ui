// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DAppProvider, Config, Mainnet, Sepolia, Localhost } from '@usedapp/core';

const config: Config = {
  networks: [Localhost, Mainnet, Sepolia],  // Including multiple networks
};

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
