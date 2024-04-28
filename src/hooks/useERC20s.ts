import { useContractFunction, useEthers } from '@usedapp/core';
import { Coupon } from '../../types/ethers';  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';

//BUG: too many -re-renders
//Never import this directly. Call the blockchain context
import { useMemo } from 'react';

const useERC20s = (addresses: ContractAddresses | null): Coupon[] => {
    const provider = useProvider();

    return useMemo(() => {
        if (addresses && addresses.Inputs && provider) {
            const signer = provider.getSigner();
            return addresses.Inputs.map(address => (
                new Contract(
                    address,
                    ABIs.Coupon,
                    signer
                ) as unknown as Coupon
            ));
        }
        return [];
    }, [addresses, provider]); // Dependency array
};


export default useERC20s