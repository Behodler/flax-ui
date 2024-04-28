import { useState, useEffect } from 'react';
import { ContractAddresses } from '../types/ContractAddresses';
import useCoupon from './useCoupon';
import useIssuer from './useIssuer';
import useERC20s from './useERC20s';
import { Contracts } from '../contexts/BlockchainContextProvider';
import { Coupon } from '../../types/ethers';
import _ from 'lodash'
// Custom hook to manage contracts based on addresses
export function useContracts(addresses: ContractAddresses | null): Contracts | undefined {
    const [contracts, setContracts] = useState<Contracts | undefined>();
    const coupon = useCoupon(addresses);
    const issuer = useIssuer(addresses);
    const inputs = useERC20s(addresses);
    const newContracts = { coupon, issuer, inputs }
    const isNew:boolean = !_.isEqual(newContracts,contracts)
    if (coupon && issuer && inputs && isNew){
        setContracts({ coupon, issuer, inputs });
    }
    return contracts;
}
