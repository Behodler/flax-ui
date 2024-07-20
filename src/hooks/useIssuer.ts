import { useContractFunction, useEthers } from '@usedapp/core';
import { Issuer } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useMemo } from 'react';


//Never import this directly. Call the blockchain context
const useIssuer = (addresses: ContractAddresses | null): Issuer | undefined => {
  
    const provider = useProvider();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider && addresses && addresses.Issuer) {
            const issuerContract = new Contract(
                addresses.Issuer,
                ABIs.Issuer,
                provider.getSigner()
            ) as unknown as Issuer;  // Type assertion here

            // Now you can use issuerContract as a Issuer instance with all methods strongly typed
            return issuerContract;
        }
        return undefined
    }, [provider, addresses])
};

export default useIssuer