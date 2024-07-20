import { useBlockNumber, useContractFunction, useEthers } from '@usedapp/core';
import { Issuer, Multicall3 } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract, BigNumber } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { Contracts, useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useEffect, useMemo, useState } from 'react';
import { useDeepCompareEffect } from './useDeepCompareEffect';
import _ from 'lodash';

interface TokenInfo {
    currentPrice: BigNumber,
    burnable: boolean
    enabled: boolean,
    lastminted_timestamp: BigNumber,
    teraCouponPerTokenPerSecond: BigNumber
}

interface TokenInfoMap {
    [tokenAddress: string]: TokenInfo
}

//This will be in tera units
const getPrice = (info: TokenInfo): BigNumber => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const secondsElapsed = BigNumber.from(currentTimestamp).sub(info.lastminted_timestamp).toNumber();
    return info.teraCouponPerTokenPerSecond.mul(secondsElapsed)

}

const useMultiTokenInfo = (multicall3: Multicall3 | undefined, issuer: Issuer | undefined, tokens: string[] | undefined, refresh: boolean): TokenInfoMap | undefined => {
    const provider = useProvider()
    const [initialized, setInitialized] = useState<boolean>(false)
    const [info, setInfo] = useState<TokenInfoMap>()
    const blocknumber = useBlockNumber()

    //keeps price real time
    useEffect(() => {
        if (tokens && info) {
            const cloned = _.cloneDeep(info)
            for (let i = 0; i < tokens.length; i++) {
                const currentToken = tokens[i]
                const currentInfo = cloned[currentToken]
                cloned[currentToken].currentPrice = getPrice(currentInfo)
            }
            if (!_.isEqual(cloned, info)) {
                setInfo(cloned)
            }
        }
    }, [blocknumber, tokens])

    useEffect(() => {
        if (refresh) {
            setInitialized(false)
        }
    }, [refresh])

    useDeepCompareEffect(() => {
        if (blocknumber && (!initialized || blocknumber % 5 == 0)) {
            if (provider && tokens && multicall3 && issuer) {
                (async () => {
                    const calls = tokens.map(tokenAddress => {
                        return {
                            target: issuer.address,
                            callData: issuer.interface.encodeFunctionData('whitelist', [tokenAddress])
                        };
                    });
                    const { blockNumber, returnData } = await multicall3.callStatic.aggregate(calls);
                    const results = returnData.map((data, i) => {
                        const address = tokens[i]
                        const info = ethers.utils.defaultAbiCoder.decode(
                            ['bool', 'bool', 'uint256', 'uint256'],
                            data
                        );
                        let castInfo: TokenInfo = {
                            enabled: info[0],
                            burnable: info[1],
                            lastminted_timestamp: info[2],
                            teraCouponPerTokenPerSecond: info[3],
                            currentPrice: BigNumber.from(0)
                        }
                        castInfo.currentPrice = getPrice(castInfo)
                        return { address, castInfo }
                    })
                        .reduce((acc: TokenInfoMap, current) => {
                            acc[current.address] = current.castInfo
                            return acc
                        }, {})
                    setInfo(results)
                })()

            }
        }


    }, [blocknumber, tokens, provider, issuer, multicall3])
    return info
}

const useMultiTokenBalances = (multicall3: Multicall3 | undefined, holder: string | undefined, tokens: string[] | undefined, refresh: boolean): Record<string, BigNumber> | undefined => {
    const provider = useProvider()
    const [initialized, setInitialized] = useState<boolean>(false)
    const [balances, setBalances] = useState<Record<string, BigNumber> | undefined>()
    const blocknumber = useBlockNumber()

    useEffect(() => {
        if (refresh) {
            setInitialized(false)
        }
    }, [refresh])

    useEffect(() => {
        setInitialized(false)
    }, [holder, tokens])
    useDeepCompareEffect(() => {
        if (blocknumber && (!initialized || blocknumber % 5 == 0)) {
            if (provider && holder && tokens && multicall3) {
                (async () => {
                    const calls = tokens.map(tokenAddress => {
                        const tokenContract = new ethers.Contract(tokenAddress, ABIs.ERC20, provider);
                        return {
                            target: tokenAddress,
                            callData: tokenContract.interface.encodeFunctionData('balanceOf', [holder])
                        };
                    });
                    // const {blockNumber,returnData}= await multicall3.aggregate(calls) as unknown as { blockNumber: number, returnData: string[] };
                    // setBalances(returnData.map(data => ethers.BigNumber.from(data)))
                    const { blockNumber, returnData } = await multicall3.callStatic.aggregate(calls);
                    setBalances(returnData.map((data, i) => ({ address: tokens[i], balance: ethers.utils.defaultAbiCoder.decode(['uint256'], data)[0] }))
                        .reduce((acc, current) => {
                            acc[current.address] = current.balance;
                            return acc;
                        }, {} as Record<string, BigNumber>))
                    setInitialized(true)
                })()
            }
        }
    }, [blocknumber, holder, tokens, provider, multicall3])


    return balances;
};


export interface DynamicTokenInfo {
    balance: BigNumber
    burnable: boolean
    teraCouponPerToken: BigNumber
}
type DynamicInfoMap = Record<string, DynamicTokenInfo>
export const useDynamicTokenInfo = (contracts: Contracts | undefined, account: string | undefined, tokens: string[] | undefined, refresh: boolean): DynamicInfoMap | undefined => {
    const [dynamicInfo, setDynamicInfo] = useState<DynamicInfoMap>()

    const tokenInfo = useMultiTokenInfo(contracts?.multicall3, contracts?.issuer, tokens, refresh)
    const balances = useMultiTokenBalances(contracts?.multicall3, account, tokens, refresh)

    useEffect(() => {
        if (balances && tokenInfo && tokens) {

            setDynamicInfo(tokens.map(token => {
                const info: DynamicTokenInfo = {
                    balance: balances[token],
                    burnable: tokenInfo[token].burnable,
                    teraCouponPerToken: tokenInfo[token].currentPrice
                }
                return { token, info }
            }).reduce((acc, current) => {
                acc[current.token] = current.info
                return acc
            }, {} as DynamicInfoMap))
        }
    }, [tokenInfo, balances])

    return dynamicInfo
}


