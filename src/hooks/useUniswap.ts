import { Contract, ethers } from 'ethers';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useEffect, useMemo, useState } from 'react';
import { UniswapV2Router02, UniswapV2Factory } from '../typechain/types/ethers';
import ABIs from "../constants/ABIs.json"

const useUniswapRouter = (addresses: ContractAddresses | null, provider: ethers.providers.Web3Provider | undefined): UniswapV2Router02 | undefined => {

    return useMemo(() => {
        if (provider && addresses) {
            return new Contract(
                addresses.UniswapV2Router,
                ABIs.UniswapV2Router02,
                provider.getSigner()
            ) as unknown as UniswapV2Router02
        }
    }, [provider, addresses])
}

interface Uniswap {
    factory: UniswapV2Factory,
    router: UniswapV2Router02
}

export const useUniswap = (addresses: ContractAddresses | null): Uniswap | undefined => {
    const provider = useProvider()
    const router = useUniswapRouter(addresses, provider)
    const [factory, setFactory] = useState<UniswapV2Factory>()

    useEffect(() => {
        if (provider && router) {
            (async () => {
                const factoryAddress = await router.factory()
                setFactory(
                    new Contract(factoryAddress, ABIs.UniswapV2Factory, provider.getSigner()) as unknown as UniswapV2Factory
                )
            })()
        }
    }, [router])

    if (factory && router) {
        return { factory, router }
    }
    return undefined
}