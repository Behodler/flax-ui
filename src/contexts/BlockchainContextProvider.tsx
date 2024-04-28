import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useEthers, MultiCall } from '@usedapp/core';
import { ChainID } from '../types/ChainID';
import { Coupon, ERC20, Issuer } from '../../types/ethers';
import useAddresses from '../hooks/useAddresses'; // Updated import for renamed hook
import { useContracts } from '../hooks/useContracts';
import { ethers, providers } from 'ethers';

export interface Contracts {
    coupon: Coupon;
    issuer: Issuer;
    inputs: ERC20[];
}

interface BlockchainContextType {
    chainID: ChainID;
    contracts: Contracts;
    account: string
}

const BlockchainContext = createContext<BlockchainContextType>({ chainID: ChainID.disconnected, contracts: {} as any, account: "0x0" });

interface BlockchainProviderProps {
    children: ReactNode;
}

interface EthWindow {
    ethereum: any
}

export const BlockchainContextProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
    const { account, chainId, active, activateBrowserWallet } = useEthers();
    const { addresses } = useAddresses(chainId as ChainID); // useAddresses is called regardless of condition
    const contracts = useContracts(addresses)
    const ethWindow: EthWindow = (window as unknown) as EthWindow
    // console.log(`active ${active}, account ${!!account}`)
    useEffect(() => {
        if ((!account || !active) && ethWindow.ethereum) {
            activateBrowserWallet();
        }
    }, [active, account, ethWindow.ethereum]);

    // Derive the currentChainID based on presence of window.ethereum and account
    const currentChainID = !ethWindow.ethereum ? ChainID.absent
        : !account ? ChainID.disconnected
            : chainId as ChainID;
    if (!contracts ||!account) return <div>loading...</div>
    return (
        <BlockchainContext.Provider value={{ chainID: currentChainID, contracts, account }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchainContext = () => useContext(BlockchainContext);
