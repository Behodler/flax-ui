import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { ChainID, supportedChain } from '../types/ChainID'
import { Coupon, ERC20, HedgeyAdapter, Issuer, Multicall3, Test, TestnetFaucet, TilterFactory, TokenLockupPlans, UniPriceFetcher, UniswapV2Factory, UniswapV2Router02 } from "../typechain/types/ethers";
import useAddresses from '../hooks/useAddresses'; // Updated import for renamed hook
import { useContracts } from '../hooks/useContracts';
import { BigNumber } from 'ethers';
import _, { add } from 'lodash';
import { DynamicTokenInfo, useDynamicTokenInfo } from '../hooks/useDynamicTokenInfo';
import { isTiltingTokenFactory } from '../extensions/Utils';
import useInputPrices from '../hooks/useInputPrices';
import { useAnchorPrices } from '../hooks/useAnchorPrices';
import { useTokenLockupConfig } from '../hooks/useTokenLockupConfig';
import { defaultRewardConfig, RewardConfig, useRewardConfig } from '../hooks/useRewardConfig';
import { useCustomRewardBalance } from '../hooks/useCustomRewardBalance';
// import { useMultipleTokenBalances } from '../hooks/useMultipleTokenBalances';
import { useDerivedChainId } from '../hooks/useDerivedChainId';

export interface Contracts {
    coupon: Coupon;
    issuer: Issuer;
    inputs: ERC20[];
    hedgey: HedgeyAdapter
    uniswapRouter: UniswapV2Router02,
    uniswapFactory: UniswapV2Factory
    tilterFactory: TilterFactory
    tokenLockup: TokenLockupPlans
    multicall3: Multicall3
    uniPriceFetcher: UniPriceFetcher
    faucet?: TestnetFaucet
}

export interface TokenLockupConfig {
    threshold_size: number
    days_multiple: number,
    offset: number,
}

export const defaultLockup: TokenLockupConfig = { threshold_size: 0, days_multiple: 0, offset: 0 }


const defaultIsEth = (token: string) => false
const defaultIsTiltingToken = defaultIsEth

interface BlockchainContextType {
    chainId: ChainID;
    contracts: Contracts | undefined;
    account: string | undefined
    selectedAssetId: string,
    rewardConfig: RewardConfig
    customRewardBalance: BigNumber
    flxDollarPrice: BigNumber,
    setSelectedAssetId: (assetId: string) => void
    dynamicTokenInfo: Record<string, DynamicTokenInfo> | undefined
    daiPriceOfEth: BigNumber | undefined
    tokenLockupConfig: TokenLockupConfig,
    inputDollarPrices: Record<string, BigNumber>
    refreshMultiCalls: () => void
    isEth: (token: string) => boolean
    isTiltingToken: (token: string) => boolean
    rewardTokenName: string
}



const BlockchainContext = createContext<BlockchainContextType>({
    chainId: ChainID.disconnected, contracts: {} as any, account: "0x0", selectedAssetId: '', flxDollarPrice: BigNumber.from('100000000000000000'),
    setSelectedAssetId: (id: string) => { }, dynamicTokenInfo: undefined, daiPriceOfEth: undefined,
    tokenLockupConfig: defaultLockup, refreshMultiCalls: () => { }, isEth: defaultIsEth, isTiltingToken: defaultIsTiltingToken, inputDollarPrices: {}, rewardConfig: defaultRewardConfig,
    customRewardBalance: BigNumber.from(0), rewardTokenName: ''
});

interface BlockchainProviderProps {
    children: ReactNode;
}

interface EthWindow {
    ethereum: any
}
export const BlockchainContextProvider: React.FC<BlockchainProviderProps> = ({ children }) => {

    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [refresh, setRefresh] = useState<number>(0)
    const { derivedChainId, account } = useDerivedChainId(setRefresh, refresh)

    const { addresses } = useAddresses(derivedChainId);

    const contracts = useContracts(addresses);

    const isTiltingToken = isTiltingTokenFactory(derivedChainId)
    const dynamicTokenInfo = useDynamicTokenInfo(contracts, account, addresses, refresh)
    const pricedTokens = addresses ? [addresses.Coupon, addresses.Weth, ...addresses.Inputs] : []
    const inputDollarPrices = useInputPrices(contracts?.uniPriceFetcher, pricedTokens, refresh)

    const { flxDollarPrice, daiPriceOfEth } = useAnchorPrices(inputDollarPrices, addresses)
    const tokenLockupConfig = useTokenLockupConfig(contracts?.issuer)
    const rewardConfig = useRewardConfig(contracts?.issuer, refresh)
    const { customRewardBalance, rewardTokenName } = useCustomRewardBalance(addresses?.Issuer, rewardConfig.token, refresh)

    return (
        <BlockchainContext.Provider value={{
            chainId: derivedChainId,
            contracts,
            account,
            selectedAssetId,
            setSelectedAssetId,
            dynamicTokenInfo,
            flxDollarPrice,
            daiPriceOfEth,
            inputDollarPrices,
            rewardConfig,
            tokenLockupConfig,
            customRewardBalance,
            rewardTokenName,
            refreshMultiCalls: () => { console.log('Refreshed at ' + Date()); setTimeout(() => setRefresh(refresh + 1), 10000) },
            isEth: addresses ? (token: string) => token === addresses.Weth : defaultIsEth,
            isTiltingToken
        }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchainContext = () => useContext(BlockchainContext);