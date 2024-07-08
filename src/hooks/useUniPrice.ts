import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { ethers, BigNumber } from 'ethers';
import { ChainId, Token, WETH9, CurrencyAmount } from '@uniswap/sdk-core'
import { useProvider } from './useProvider';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { Route } from '@uniswap/v2-sdk'
import { ChainID } from '../types/ChainID';
import { Pair } from '@uniswap/v2-sdk'
import UniV2Pair from '../constants/UniV2PairABI.json'

//docs: https://docs.uniswap.org/sdk/v2/guides/pricing
export function useUniPrice(dependent: string, independent: string): BigNumber | undefined {
    const blockchain = useBlockchainContext()
    const [price, setPrice] = useState<BigNumber | undefined>()
    const provider = useProvider()

    //const weth= WETH9[ChainId.MAINNET]

    const dependentToken = new Token(ChainId.MAINNET, dependent, 18)
    const independentToken = new Token(ChainId.MAINNET, dependent, 18)

    useEffect(() => {
        const fetchTokenPrice = async () => {
            const pairAddress = Pair.getAddress(dependentToken, independentToken)
            const pairContract = new ethers.Contract(pairAddress, UniV2Pair.UniV2, provider)
            const reserves = await pairContract["getReserves"]()
            const [reserve0, reserve1] = reserves
            const tokens = [independentToken, dependentToken]
            const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]
            const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))

            const route = new Route([pair], dependentToken, independentToken)
            setPrice(BigNumber.from(route.midPrice.toSignificant(6)))
        }
        if (provider !== undefined  && isEthAddress(dependent) && isEthAddress(independent))
            fetchTokenPrice();
    }, [dependentToken, independentToken, blockchain.chainId, provider])
    return price
}

const isEthAddress = (address: string | undefined) => {
    if (!address)
        return false
    // Regex to check if the address is exactly 42 characters long, starts with '0x', followed by exactly 40 hexadecimal characters.
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}
