import { Contract, ethers } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { Coupon, UniPriceFetcher } from '../typechain/types/ethers'
import { useEthers } from '@usedapp/core';
import { useProvider } from './useProvider';
import { useMemo, useRef } from 'react';
import { useRenderCount } from './useDebug';

//Never import this directly. Call the blockchain context
const useUniPriceFetcher = (addresses: ContractAddresses | null): UniPriceFetcher | undefined => {
    const provider = useProvider();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider && addresses && addresses.UniPriceFetcher) {
            const signer = provider.getSigner()
            const uniPriceFetcherContract = new Contract(
                addresses.UniPriceFetcher,
                ABIs.UniPriceFetcher,
                signer
            ) as unknown as UniPriceFetcher;  // Type assertion here
            // Now you can use issuerContract as a Issuer instance with all methods strongly typed
            return uniPriceFetcherContract;
        }
        return undefined
    }, [provider, addresses])
};

export default useUniPriceFetcher