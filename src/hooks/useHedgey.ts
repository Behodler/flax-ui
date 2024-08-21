import { useContractFunction, useEthers } from '@usedapp/core';
import { HedgeyAdapter } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useMemo } from 'react';
import { useEthersSigner } from './useEthersProvider';


//Never import this directly. Call the blockchain context
const useHedgey = (addresses: ContractAddresses | null): HedgeyAdapter | undefined => {
    const signer = useEthersSigner();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (signer && addresses && addresses.HedgeyAdapter) {
            const hedgeyContract = new Contract(
                addresses.HedgeyAdapter,
                ABIs.HedgeyAdapter,
                signer
            ) as unknown as HedgeyAdapter;  // Type assertion here

            // Now you can use faucetContract as a Faucet instance with all methods strongly typed
            return hedgeyContract;
        }
        return undefined
    }, [signer, addresses])
};

export default useHedgey