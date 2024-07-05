import { useState, useEffect } from 'react';
import { ContractAddresses } from '../types/ContractAddresses';
import useCoupon from './useCoupon';
import useIssuer from './useIssuer';
import useFaucet from './useFaucet';
import useERC20s from './useERC20s';
import { Contracts } from '../contexts/BlockchainContextProvider';
import _ from 'lodash'
// Custom hook to manage contracts based on addresses
export function useContracts(addresses: ContractAddresses | null): Contracts | undefined {
    const [contracts, setContracts] = useState<Contracts | undefined>();
    const coupon = useCoupon(addresses);
    const issuer = useIssuer(addresses);
    const inputs = useERC20s(addresses);
    const faucet = useFaucet(addresses);
    const newContracts = { coupon, issuer, inputs, faucet}
    const isNew: boolean = !_.isEqual(newContracts, contracts)
    if (coupon && issuer && inputs && isNew) {
        setContracts({ coupon, issuer, inputs, faucet });
    }
    return contracts;
}
