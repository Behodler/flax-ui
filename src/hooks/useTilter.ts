import { Contract, ethers } from 'ethers';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useMemo } from 'react';
import { Tilter, TilterFactory } from '../typechain/types/ethers';
import ABIs from "../constants/ABIs.json"

const useTilterFactory = (addresses: ContractAddresses | null): TilterFactory | undefined => {
    const provider = useProvider()
    return useMemo(() => {
        if (provider && addresses) {
            return new Contract(
                addresses.TilterFactory,
                ABIs.TilterFactory,
                provider.getSigner()
            ) as unknown as TilterFactory
        }
    }, [provider,addresses])
}

const useTilter = (tilterAddress: string): Tilter | undefined => {
    const provider = useProvider();


    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider) {
            const tilter = new Contract(
                tilterAddress,
                ABIs.Tilter,
                provider.getSigner()
            ) as unknown as Tilter;  // Type assertion here

            // Now you can use multicall3Contract as a Multicall3 instance with all methods strongly typed
            return tilter;
        }
        return undefined
    }, [provider, tilterAddress])
};

const getTilter = (address: string, provider: ethers.providers.Web3Provider): Tilter | undefined => {
    if (address == ethers.constants.AddressZero)
        return undefined
    const tilter = new Contract(
        address,
        ABIs.Tilter,
        provider.getSigner()
    ) as unknown as Tilter;  // Type assertion here

    return tilter
}

export { useTilter, getTilter, useTilterFactory }