import { useContractFunction, useEthers } from '@usedapp/core';
import { Coupon, ERC20 } from '../../types/ethers';  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';

import { useMemo } from 'react';

const useERC20s = (addresses: ContractAddresses | null): Coupon[] | undefined => {
    const provider = useProvider();
    const addressesString = JSON.stringify(addresses)
    return useMemo(() => {
        if (addresses && addresses.Inputs && provider) {
            const signer = provider.getSigner();
            return addresses.Inputs.map(address => {
                return new Contract(
                    address,
                    ABIs.Coupon,
                    signer
                ) as unknown as Coupon
            });
        }
        return undefined;
    }, [addresses, provider, addressesString]); // Dependency array
};


export default useERC20s