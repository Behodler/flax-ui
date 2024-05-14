import { Contract, ethers } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { Coupon } from '../typechain/types/ethers'
import { useEthers } from '@usedapp/core';
import { useProvider } from './useProvider';
import { useMemo, useRef } from 'react';
import { useRenderCount } from './useDebug';

//Never import this directly. Call the blockchain context
const useCoupon = (addresses: ContractAddresses | null): Coupon | undefined => {
    useRenderCount("useCoupon",false)
    const provider = useProvider();
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider && addresses && addresses.Coupon) {
            const signer = provider.getSigner()
            const couponContract = new Contract(
                addresses.Coupon,
                ABIs.Coupon,
                signer
            ) as unknown as Coupon;  // Type assertion here
            // Now you can use issuerContract as a Issuer instance with all methods strongly typed
            return couponContract;
        }
        return undefined
    }, [provider, addresses])
};

export default useCoupon