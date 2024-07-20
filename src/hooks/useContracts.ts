import { useState, useEffect } from 'react';
import { ContractAddresses } from '../types/ContractAddresses';
import useCoupon from './useCoupon';
import useIssuer from './useIssuer';
import useFaucet from './useFaucet';
import useERC20s from './useERC20s';
import { Contracts } from '../contexts/BlockchainContextProvider';
import _ from 'lodash'
import useHedgey from './useHedgey';
import useTokenLockUpPlans from './useTokenLockup';
import useMulticall3 from './useMulticall3';
// Custom hook to manage contracts based on addresses
export function useContracts(addresses: ContractAddresses | null): Contracts | undefined {
    const [contracts, setContracts] = useState<Contracts | undefined>();
    const coupon = useCoupon(addresses);
    const issuer = useIssuer(addresses);
    const inputs = useERC20s(addresses);
    const faucet = useFaucet(addresses);
    const hedgey = useHedgey(addresses);
    const tokenLockup = useTokenLockUpPlans(hedgey);
    const multicall3 = useMulticall3(addresses);

    const newContracts = { coupon, issuer, inputs, faucet, hedgey, tokenLockup, multicall3 }
    const isNew: boolean = !_.isEqual(newContracts, contracts)
    if (coupon && issuer && hedgey && tokenLockup && multicall3 && inputs && isNew) {
        setContracts({ coupon, issuer, inputs, faucet, hedgey, tokenLockup, multicall3 });
    }
    return contracts;
}
