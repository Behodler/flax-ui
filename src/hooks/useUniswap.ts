import { Contract, ethers, providers } from 'ethers';
import { ContractAddresses } from '../types/ContractAddresses';
import { useEffect, useMemo, useState } from 'react';
import { UniswapV2Router02, UniswapV2Factory } from '../typechain/types/ethers';
import ABIs from "../constants/ABIs.json"
import { useEthersSigner } from './useEthersProvider';

const useUniswapRouter = (addresses: ContractAddresses | null, signer: providers.JsonRpcSigner | undefined): UniswapV2Router02 | undefined => {

    return useMemo(() => {
        if (signer && addresses) {
            return new Contract(
                addresses.UniswapV2Router,
                ABIs.UniswapV2Router02,
                signer
            ) as unknown as UniswapV2Router02
        }
    }, [signer, addresses])
}

interface Uniswap {
    factory: UniswapV2Factory,
    router: UniswapV2Router02
}

export const useUniswap = (addresses: ContractAddresses | null): Uniswap | undefined => {
    const signer = useEthersSigner()
    const router = useUniswapRouter(addresses, signer)
    const [factory, setFactory] = useState<UniswapV2Factory>()

    useEffect(() => {
        if (signer && router) {
            (async () => {
                const factoryAddress = await router.factory()
                setFactory(
                    new Contract(factoryAddress, ABIs.UniswapV2Factory, signer) as unknown as UniswapV2Factory
                )
            })()
        }
    }, [router])

    if (factory && router) {
        return { factory, router }
    }
    return undefined
}