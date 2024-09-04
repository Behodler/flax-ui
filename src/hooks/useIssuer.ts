import { useContractFunction, useEthers } from '@usedapp/core';
import { Issuer } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useEffect, useMemo, useState } from 'react';
import { useEthersSigner } from './useEthersProvider';


//Never import this directly. Call the blockchain context
const useIssuer = (addresses: ContractAddresses | null): { issuer: Issuer | undefined, issuerIsMinter: boolean } => {
    const [issuerIsMinter, setIssuerIsMinter] = useState<boolean>(false)
    const signer = useEthersSigner();
    // Create a Contract instance and assert the correct type
    const issuer = useMemo(() => {
        if (signer && addresses && addresses.Issuer) {
            const issuerContract = new Contract(
                addresses.Issuer,
                ABIs.Issuer,
                signer
            ) as unknown as Issuer;  // Type assertion here

            // Now you can use issuerContract as a Issuer instance with all methods strongly typed
            return issuerContract;
        }
        return undefined
    }, [signer, addresses])

    useEffect(() => {
        if (issuer) {
            (async () => {
                try {
                    const isMinter = await issuer.minter()
                    setIssuerIsMinter(isMinter)
                } catch {
                    setIssuerIsMinter(true)
                }
            })()
        }
    }, [issuer])
    return { issuer, issuerIsMinter }
};

export default useIssuer