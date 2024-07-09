import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { ChainID, supportedChain } from '../types/ChainID'
import { Coupon, ERC20, HedgeyAdapter, Issuer, Test, TestnetFaucet, TokenLockupPlans } from "../typechain/types/ethers";
import useAddresses from '../hooks/useAddresses'; // Updated import for renamed hook
import { useContracts } from '../hooks/useContracts';
import { BigNumber } from 'ethers';
import _ from 'lodash';
import { getDaiPriceOfEth } from '../extensions/Uniswap';
import { useProvider } from '../hooks/useProvider';


export interface Contracts {
    coupon: Coupon;
    issuer: Issuer;
    inputs: ERC20[];
    hedgey: HedgeyAdapter
    tokenLockup: TokenLockupPlans
    faucet?: TestnetFaucet
}
export interface DynamicTokenInfo {
    balance: BigNumber
    burnable: boolean
    teraCouponPerToken: BigNumber
}
interface BlockchainContextType {
    chainId: ChainID;
    contracts: Contracts | undefined;
    account: string | undefined
    selectedAssetId: string,
    flxLaunchDaiPrice: BigNumber,
    setSelectedAssetId: (assetId: string) => void
    dynamicTokenInfo: Record<string, DynamicTokenInfo>
    updateDynamicTokenInfo: (address: string, value: DynamicTokenInfo) => void
    daiPriceOfEth: BigNumber | undefined
}

const BlockchainContext = createContext<BlockchainContextType>({
    chainId: ChainID.disconnected, contracts: {} as any, account: "0x0", selectedAssetId: '', flxLaunchDaiPrice: BigNumber.from('100000000000000000'),
    setSelectedAssetId: (id: string) => { }, dynamicTokenInfo: {}, updateDynamicTokenInfo: (address, value) => { }, daiPriceOfEth: undefined
});

interface BlockchainProviderProps {
    children: ReactNode;
}

interface EthWindow {
    ethereum: any
}
export const BlockchainContextProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
    const { account, active, activateBrowserWallet } = useEthers();
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const ethWindow: EthWindow = (window as unknown) as EthWindow;
    const [derivedChainId, setDerivedChainId] = useState<ChainID>(ChainID.absent);
    const [dynamicTokenInfo, setDynamicTokenInfo] = useState<Record<string, DynamicTokenInfo>>({});
    const [daiPriceOfEth, setDaiPriceOfEth] = useState<BigNumber | undefined>()
    // Fetch addresses and contracts whenever chainId changes
    const { addresses } = useAddresses(derivedChainId);

    const contracts = useContracts(addresses);
    useEffect(() => {
        if ((!account || !active) && ethWindow.ethereum) {
            activateBrowserWallet();
        }

        const handleChainChanged = async (chainIdHex: string) => {
            const chainId: ChainID = parseInt(chainIdHex, 16);
            if (supportedChain(chainId)) {
                setDerivedChainId(chainId);
            } else {
                setDerivedChainId(ChainID.unsupported);
            }
        };

        const getChainIdFromMetamask = async () => {
            if (!ethWindow.ethereum) {
                setDerivedChainId(ChainID.absent);
            } else if (!account || !active) {
                setDerivedChainId(ChainID.disconnected);
            } else {
                const chainIdHex: string = await ethWindow.ethereum.request({ method: 'eth_chainId' });
                handleChainChanged(chainIdHex);
            }
        };

        getChainIdFromMetamask();
        ethWindow.ethereum?.on('chainChanged', handleChainChanged);

        return () => {
            ethWindow.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [active, account, ethWindow.ethereum]);

    const ethProvider = useProvider()
    useEffect(() => {
        if (derivedChainId === ChainID.mainnet && ethProvider) {
            const getDaiPrice = async () => {
                setDaiPriceOfEth(await getDaiPriceOfEth(ethProvider))
            }
            getDaiPrice()
        }
        else {
            setDaiPriceOfEth(undefined)
        }
    }, [derivedChainId, ethProvider])

    const updateBalance = (address: string, value: DynamicTokenInfo) => {
        if (!_.isEqual(dynamicTokenInfo[address], value)) {
            const newBalanceMap = _.clone(dynamicTokenInfo);
            newBalanceMap[address] = value
            setDynamicTokenInfo(newBalanceMap);
        }
    };

    return (
        <BlockchainContext.Provider value={{
            chainId: derivedChainId,
            contracts,
            account,
            selectedAssetId,
            setSelectedAssetId,
            dynamicTokenInfo,
            flxLaunchDaiPrice: BigNumber.from('100000000000000000'),
            updateDynamicTokenInfo: updateBalance,
            daiPriceOfEth
        }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchainContext = () => useContext(BlockchainContext);