import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useEthers, MultiCall } from '@usedapp/core';
import { ChainID } from '../types/ChainID'
import { Coupon, ERC20, Issuer } from '../../types/ethers';
import useAddresses from '../hooks/useAddresses'; // Updated import for renamed hook
import { useContracts } from '../hooks/useContracts';
import { BigNumber, ethers, providers } from 'ethers';
import _ from 'lodash';


export interface Contracts {
    coupon: Coupon;
    issuer: Issuer;
    inputs: ERC20[];
}
export interface DynamicTokenInfo {
    balance:BigNumber
    burnable:boolean
    teraCouponPerToken:BigNumber
}
interface BlockchainContextType {
    chainId: ChainID;
    contracts: Contracts;
    account: string
    selectedAssetId: string,
    setSelectedAssetId: (assetId: string) => void
    dynamicTokenInfo: Record<string, DynamicTokenInfo>
    updateDyamicTokenInfo: (address: string, value: DynamicTokenInfo) => void
}

const BlockchainContext = createContext<BlockchainContextType>({
    chainId: ChainID.disconnected, contracts: {} as any, account: "0x0", selectedAssetId: '',
    setSelectedAssetId: (id: string) => { }, dynamicTokenInfo: {}, updateDyamicTokenInfo: (address, value) => { }
});

interface BlockchainProviderProps {
    children: ReactNode;
}

interface EthWindow {
    ethereum: any
}

export const BlockchainContextProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
    const { account, chainId, active, activateBrowserWallet } = useEthers();
    const { addresses } = useAddresses(chainId as ChainID); // useAddresses is called regardless of condition
    const [selectedAssetId, setSelectedAssetId] = useState<string>('')
    const contracts = useContracts(addresses)
    const ethWindow: EthWindow = (window as unknown) as EthWindow
    const [derivedChainId, setDerivedChainId] = useState<ChainID>(ChainID.absent)
    const [dynamicTokenInfo, setDynamicTokenInfo] = useState<Record<string, DynamicTokenInfo>>({})

    // console.log(`active ${active}, account ${!!account}`)
    useEffect(() => {
        if ((!account || !active) && ethWindow.ethereum) {
            activateBrowserWallet();
        }
        const getChainIdFromMetamask = async () => {
            if (!ethWindow.ethereum) {
                setDerivedChainId(ChainID.absent)
            }
            if (!account || !active) {
                setDerivedChainId(ChainID.disconnected)
            }
            else {
                const chainId = await ethWindow.ethereum.request({ method: 'eth_chainId' });
                setDerivedChainId(parseInt(BigInt(chainId).toString()))
            }
        }
        getChainIdFromMetamask()
    }, [active, account, ethWindow.ethereum]);

    const updateBalance = (address: string, value: DynamicTokenInfo) => {
        if (!_.isEqual(dynamicTokenInfo[address], value)) {
            const newBalanceMap = _.clone(dynamicTokenInfo)
            newBalanceMap[address] = value
            setDynamicTokenInfo(newBalanceMap)
        }
    }
   
    if (!contracts || !account) return <h1>loading...</h1>

    return (
        <BlockchainContext.Provider value={{ chainId: derivedChainId, contracts, account, selectedAssetId, setSelectedAssetId, dynamicTokenInfo: dynamicTokenInfo, updateDyamicTokenInfo: updateBalance }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchainContext = () => useContext(BlockchainContext);
