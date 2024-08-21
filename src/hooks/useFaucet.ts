import { useContractFunction, useEthers } from '@usedapp/core';
import { TestnetFaucet } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useMemo } from 'react';
import { useEthersSigner } from './useEthersProvider';


//Never import this directly. Call the blockchain context
const useFaucet = (addresses: ContractAddresses | null): TestnetFaucet | undefined => {
    const signer = useEthersSigner();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (signer && addresses && addresses.Faucet) {
            const faucetContract = new Contract(
                addresses.Faucet,
                ABIs.TestnetFaucet,
                signer
            ) as unknown as TestnetFaucet;  // Type assertion here

            // Now you can use faucetContract as a Faucet instance with all methods strongly typed
            return faucetContract;
        }
        return undefined
    }, [signer, addresses])
};

export default useFaucet