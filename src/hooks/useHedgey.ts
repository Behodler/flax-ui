import { useContractFunction, useEthers } from '@usedapp/core';
import { HedgeyAdapter } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useMemo } from 'react';


//Never import this directly. Call the blockchain context
const useHedgey = (addresses: ContractAddresses | null): HedgeyAdapter | undefined => {
    const provider = useProvider();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider && addresses && addresses.HedgeyAdapter) {
            const hedgeyContract = new Contract(
                addresses.HedgeyAdapter,
                ABIs.HedgeyAdapter,
                provider.getSigner()
            ) as unknown as HedgeyAdapter;  // Type assertion here

            // Now you can use faucetContract as a Faucet instance with all methods strongly typed
            return hedgeyContract;
        }
        return undefined
    }, [provider, addresses])
};

export default useHedgey