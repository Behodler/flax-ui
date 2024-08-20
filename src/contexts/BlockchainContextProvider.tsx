import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { ChainID, supportedChain } from '../types/ChainID'
import { Coupon, ERC20, HedgeyAdapter, Issuer, Multicall3, Test, TestnetFaucet, TilterFactory, TokenLockupPlans, UniPriceFetcher, UniswapV2Factory, UniswapV2Router02 } from "../typechain/types/ethers";
import useAddresses from '../hooks/useAddresses'; // Updated import for renamed hook
import { useContracts } from '../hooks/useContracts';
import { BigNumber } from 'ethers';
import _, { add } from 'lodash';
import { useProvider } from '../hooks/useProvider';
import { DynamicTokenInfo, useDynamicTokenInfo } from '../hooks/useDynamicTokenInfo';
import { isTiltingTokenFactory } from '../extensions/Utils';
import useInputPrices from '../hooks/useInputPrices';
// import { useMultipleTokenBalances } from '../hooks/useMultipleTokenBalances';


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

const defaultLockup: TokenLockupConfig = { threshold_size: 0, days_multiple: 0, offset: 0 }
const defaultIsEth = (token: string) => false
const defaultIsTiltingToken = defaultIsEth

interface BlockchainContextType {
    chainId: ChainID;
    contracts: Contracts | undefined;
    account: string | undefined
    selectedAssetId: string,
    flxDollarPrice: BigNumber,
    setSelectedAssetId: (assetId: string) => void
    dynamicTokenInfo: Record<string, DynamicTokenInfo> | undefined
    daiPriceOfEth: BigNumber | undefined
    tokenLockupConfig: TokenLockupConfig,
    inputDollarPrices: Record<string, BigNumber>
    refreshMultiCalls: () => void
    isEth: (token: string) => boolean
    isTiltingToken: (token: string) => boolean
}



const BlockchainContext = createContext<BlockchainContextType>({
    chainId: ChainID.disconnected, contracts: {} as any, account: "0x0", selectedAssetId: '', flxDollarPrice: BigNumber.from('100000000000000000'),
    setSelectedAssetId: (id: string) => { }, dynamicTokenInfo: undefined, daiPriceOfEth: undefined,
    tokenLockupConfig: defaultLockup, refreshMultiCalls: () => { }, isEth: defaultIsEth, isTiltingToken: defaultIsTiltingToken, inputDollarPrices: {}
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

    const [daiPriceOfEth, setDaiPriceOfEth] = useState<BigNumber | undefined>()
    // Fetch addresses and contracts whenever chainId changes
    const { addresses } = useAddresses(derivedChainId);
    const [flxDollarPrice, setFlxDollarPrice] = useState<BigNumber>(BigNumber.from('100000000000000000'))
    const [tokenLockupConfig, setTokenLockupConfig] = useState<TokenLockupConfig>(defaultLockup)
    const contracts = useContracts(addresses);
    const [refresh, setRefresh] = useState<number>(0)

    const isTiltingToken = isTiltingTokenFactory(derivedChainId)
    const dynamicTokenInfo = useDynamicTokenInfo(contracts, account, addresses, refresh)
    const pricedTokens = addresses ? [addresses.Coupon, addresses.Weth, ...addresses.Inputs] : []
    const inputDollarPrices = useInputPrices(contracts?.uniPriceFetcher, pricedTokens, refresh)

    useEffect(() => {
        if (inputDollarPrices && addresses) {
            const wethPrice = inputDollarPrices[addresses.Weth]
            if (wethPrice) {
                setDaiPriceOfEth(wethPrice)
            }

            const flaxPrice = inputDollarPrices[addresses.Coupon.toLowerCase()]
            console.log('flaxPrice ' + flaxPrice.toString())
            if (flaxPrice)
                setFlxDollarPrice(flaxPrice)

        }
    }, [inputDollarPrices])

    useEffect(() => {
        if (contracts && contracts.issuer) {
            (async () => {
                const { threshold_size: threshold_sizeBig, offset: offsetBig, days_multiple: days_multipleBig } = await contracts.issuer.lockupConfig()
                const threshold_size = threshold_sizeBig.toNumber()
                const offset = offsetBig.toNumber()
                const days_multiple = days_multipleBig.toNumber()
                const newConfig: TokenLockupConfig = { threshold_size, offset, days_multiple }
                if (!_.isEqual(tokenLockupConfig, newConfig)) {
                    setTokenLockupConfig(newConfig)
                }

            })()
        }
    }, [contracts])

    useEffect(() => {
        if ((!account || !active) && ethWindow.ethereum) {
            activateBrowserWallet();
        }

        const setChain = async (chainIdHex: string) => {
            const chainId: ChainID = parseInt(chainIdHex, 16);
            if (supportedChain(chainId)) {
                setDerivedChainId(chainId);
            } else {
                setDerivedChainId(ChainID.unsupported);
            }
        };

        const handleChainChanged = () => window.location.reload();

        const getChainIdFromMetamask = async () => {
            if (!ethWindow.ethereum) {
                setDerivedChainId(ChainID.absent);
            } else if (!account || !active) {
                setDerivedChainId(ChainID.disconnected);
            } else {
                const chainIdHex: string = await ethWindow.ethereum.request({ method: 'eth_chainId' });
                setChain(chainIdHex);
            }
        };

        getChainIdFromMetamask();
        ethWindow.ethereum?.on('chainChanged', handleChainChanged);
        ethWindow.ethereum?.on('accountsChanged', handleChainChanged)
        return () => {
            ethWindow.ethereum?.removeListener('chainChanged', handleChainChanged);
            ethWindow.ethereum?.removeListener('accountsChanged', handleChainChanged);

        };
    }, [active, account, ethWindow.ethereum]);

    const ethProvider = useProvider()


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
            tokenLockupConfig,
            refreshMultiCalls: () => { console.log('Refreshed at ' + Date()); setTimeout(() => setRefresh(refresh + 1), 10000) },
            isEth: addresses ? (token: string) => token === addresses.Weth : defaultIsEth,
            isTiltingToken
        }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchainContext = () => useContext(BlockchainContext);