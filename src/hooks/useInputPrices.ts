import { multicall, useBlockNumber, useContractFunction, useEtherBalance, useEthers } from '@usedapp/core';
import { Issuer, Multicall3, Tilter, TilterFactory, UniPriceFetcher } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract, BigNumber, Overrides, PayableOverrides } from 'ethers';

import { useEffect, useState } from 'react';

import _ from 'lodash';

const useInputPrices = (uniPriceFetcher: UniPriceFetcher | undefined, tokens: string[], refreshCount: number): Record<string, BigNumber> => {
    const blockNumber = useBlockNumber()
    const [daiPrices, setDaiPrices] = useState<BigNumber[]>([])
    const [priceMapping, setPriceMapping] = useState<Record<string, BigNumber>>({})
    const [initialize, setInialize] = useState<number>(0)

    useEffect(() => {
        if (daiPrices.length == 0) {
            setInialize(initialize + 1)
        }
    }, [blockNumber])

    useEffect(() => {
        if (uniPriceFetcher && tokens && tokens.length > 0) {
            (async () => {
                const prices = await uniPriceFetcher.daiPriceOfTokens(tokens);
                setDaiPrices(prices)
            })()
        }
    }, [uniPriceFetcher, refreshCount, initialize]);

    useEffect(() => {
        if (daiPrices) {
            let mapping: Record<string, BigNumber> = {}
            for (let i = 0; i < tokens.length; i++) {
                mapping[tokens[i].toLowerCase()] = daiPrices[i]
            }
            setPriceMapping(mapping)
        }
    }, [daiPrices])

    return priceMapping
}

export default useInputPrices