import { Contract, ethers, providers } from 'ethers';
import { ContractAddresses } from '../types/ContractAddresses';
import { useMemo } from 'react';
import { Tilter, TilterFactory } from '../typechain/types/ethers';
import ABIs from "../constants/ABIs.json"
import { useEthersSigner } from './useEthersProvider';

const useTilterFactory = (addresses: ContractAddresses | null): TilterFactory | undefined => {
    const signer = useEthersSigner()
    return useMemo(() => {
        if (signer && addresses) {
            return new Contract(
                addresses.TilterFactory,
                ABIs.TilterFactory,
                signer
            ) as unknown as TilterFactory
        }
    }, [signer, addresses])
}

const useTilter = (tilterAddress: string): Tilter | undefined => {
    const signer = useEthersSigner();


    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (signer) {
            const tilter = new Contract(
                tilterAddress,
                ABIs.Tilter,
                signer
            ) as unknown as Tilter;  // Type assertion here

            // Now you can use multicall3Contract as a Multicall3 instance with all methods strongly typed
            return tilter;
        }
        return undefined
    }, [signer, tilterAddress])
};

const getTilter = (address: string, signer: providers.JsonRpcSigner): Tilter | undefined => {
    if (address == ethers.constants.AddressZero || !signer)
        return undefined
    const tilter = new Contract(
        address,
        ABIs.Tilter,
        signer
    ) as unknown as Tilter;  // Type assertion here

    return tilter
}

export { useTilter, getTilter, useTilterFactory }