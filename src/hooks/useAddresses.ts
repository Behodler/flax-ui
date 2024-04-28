import { useState, useEffect } from 'react';
import { ChainID } from '../types/ChainID';
import { ContractAddresses } from '../types/ContractAddresses';
import _ from 'lodash'
type OptionalAddresses = ContractAddresses | null
const useAddresses = (chainId: ChainID): { addresses: OptionalAddresses, loading: boolean, error: string | null } => {
    const [addresses, setAddresses] = useState<ContractAddresses | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const setIfNotEqual = (newAddresses: OptionalAddresses) => {
        if (!_.isEqual(newAddresses, addresses)) {
            setAddresses(newAddresses)
        }
    }

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                if (chainId === ChainID.anvil) {
                    const response = await fetch('http://localhost:3010/api/contract-addresses', { mode: 'cors', method: 'GET', credentials: "omit", cache: "no-cache" })
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data: ContractAddresses = await response.json();
                    setIfNotEqual(data)
                } else if (chainId === ChainID.mainnet) {
                    // Hardcoded Ethereum addresses for Mainnet
                    setIfNotEqual({ Coupon: '0x0', Issuer: '0x0', Multicall: "0x0", Inputs: ['0xAddress1...', '0xAddress2...'] });
                }
            } catch (e) {
                setError((e as any).message);
                setIfNotEqual(null)
            } finally {
                setLoading(false);
            }
        };
        if (chainId !== ChainID.absent && chainId !== ChainID.disconnected)
            fetchAddresses();
    }, [chainId]); // Depend on chainId to refetch when it changes

    return { addresses, loading, error };
};

export default useAddresses;
