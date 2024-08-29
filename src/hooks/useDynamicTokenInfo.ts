import { Issuer, Multicall3, Tilter, TilterFactory } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract, BigNumber, Overrides, PayableOverrides, providers } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { Contracts, useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useEffect, useMemo, useState } from 'react';
import { useDeepCompareEffect } from './useDeepCompareEffect';
import _ from 'lodash';
import { OptionalAddresses } from './useAddresses';
import useEthBalance from './useEthBalance';
import { ChainID } from '../types/ChainID';
import { getTilter } from './useTilter';
import { ONE } from '../extensions/Utils';
import { useEthersSigner } from './useEthersProvider';
import { useBlockNumber } from 'wagmi'

interface TokenInfo {
    burnable: boolean
    enabled: boolean,
    lastminted_timestamp: BigNumber,
    teraCouponPerTokenPerSecond: BigNumber,
    rewardEnabled: boolean
}

interface TokenInfoFlat extends TokenInfo {
    input: string
}

interface TokenFeatures extends TokenInfo {
    currentPrice: BigNumber,
    issue: (inputToken: string, amount: BigNumber, recipient: string) => Promise<any>
    issuerToApprove: string
}

interface TokenFeatureMap {
    [tokenAddress: string]: TokenFeatures
}

interface TokenTilterPair {
    inputToken: string,
    issuerToken: string
    tilter: Tilter | undefined
    priceMultiple: BigNumber
}

//This will be in tera units
const getPrice = (info: TokenFeatures): BigNumber => {
    const currentTimestamp = Math.floor(Date.now());
    const milliSecondsElapsed = BigNumber.from(currentTimestamp).sub(info.lastminted_timestamp.mul(1000)).toNumber();
    return info.teraCouponPerTokenPerSecond.mul(milliSecondsElapsed).div(1000)

}

const useMultiTilterMapping = (contracts: Contracts | undefined, tokens: string[] | undefined, signer: providers.JsonRpcSigner | undefined, refreshCount: number) => {
    const [tokenTilterPairs, setTokenTilterPairs] = useState<TokenTilterPair[]>([])
    const { data: blocknumber } = useBlockNumber()

    const [refreshing,setRefreshing] = useState<boolean>(false)
    useEffect(()=>{
        setRefreshing(true)
    },[refreshCount])

    useDeepCompareEffect(() => {
        if (contracts && contracts.multicall3 && tokens && contracts.tilterFactory && signer && (refreshing ||Number(blocknumber) % 3 === 0)) {
            (async () => {
                const calls = tokens.map(t => ({

                    target: contracts.tilterFactory.address,
                    callData: contracts.tilterFactory.interface.encodeFunctionData('tiltersByRef', [t])
                }))
                const { blockNumber, returnData } = await contracts.multicall3.callStatic.aggregate(calls)
                const pairs = returnData.map((data, i) => {
                    const inputToken = tokens[i]
                    const info = ethers.utils.defaultAbiCoder.decode(['address'], data)
                    return {
                        inputToken,
                        tilter: getTilter(info[0], signer),
                        issuerToken: inputToken,
                        priceMultiple: ONE
                    }

                })
                setTokenTilterPairs(pairs)
            })().catch(error => {
                throw "In useMutiTilterMapping: " + error
            })
            setRefreshing(false)
        }
    }, [contracts, tokens, refreshCount, blocknumber])


    return tokenTilterPairs;
}


const updateArray = (A: TokenTilterPair[], B: TokenTilterPair[]): TokenTilterPair[] => {
    const BMap = new Map<string, TokenTilterPair>(B.map(item => [item.inputToken, item]));
    return A.map(item => BMap.get(item.inputToken) ?? item)
};


const useReferencePair = (contracts: Contracts | undefined, tokenTilterPairs: TokenTilterPair[]) => {

    const [uniTokenTilterPairs, setUniTokenTilterPairs] = useState<TokenTilterPair[] | undefined>(tokenTilterPairs)
    useDeepCompareEffect(() => {
        if (tokenTilterPairs.length > 0 && contracts) {

            (async () => {
                const filteredTokens = tokenTilterPairs.filter(t => t.tilter !== undefined)
                const calls = filteredTokens
                    .map(pair => ({
                        target: contracts.uniswapFactory.address,
                        callData: contracts.uniswapFactory.interface.encodeFunctionData('getPair', [contracts.coupon.address, pair.inputToken])

                    }))
                const { blockNumber, returnData } = await contracts.multicall3.callStatic.aggregate(calls)
                const mapping: TokenTilterPair[] = returnData.map((data, i): TokenTilterPair => {
                    const info = ethers.utils.defaultAbiCoder.decode(['address'], data)
                    return {
                        inputToken: filteredTokens[i].inputToken,
                        issuerToken: info[0],
                        tilter: filteredTokens[i].tilter,
                        priceMultiple: ONE
                    }
                })
                setUniTokenTilterPairs(updateArray(tokenTilterPairs, mapping))
            })().catch(error => {
                throw "In useREferencePair: " + error
            })
        }
    }, [contracts, tokenTilterPairs])
    return uniTokenTilterPairs
}

interface TokenTilterPairWithTilter extends TokenTilterPair {
    tilter: Tilter;
}

const usePriceMultiples = (contracts: Contracts | undefined, inputTilterReferencePairs: TokenTilterPair[] | undefined): TokenTilterPair[] | undefined => {
    const [priceMultipleTokenTilterPairs, setPriceMultipleTokenTilterPairs] = useState<TokenTilterPair[] | undefined>(inputTilterReferencePairs)
    useDeepCompareEffect(() => {
        if (inputTilterReferencePairs && contracts) {
            let tilterAddresses: string[]
            (async () => {
                const filteredTokens = inputTilterReferencePairs
                    .filter((t): t is TokenTilterPairWithTilter => t.tilter !== undefined);

                const calls = filteredTokens.map(t => ({
                    target: t.tilter.address,
                    callData: t.tilter.interface.encodeFunctionData("refValueOfTilt", [ethers.constants.WeiPerEther, true])
                }))
                tilterAddresses = calls.map(c => c.target)
                // try {
                const { blockNumber, returnData } = await contracts.multicall3.callStatic.aggregate(calls)
                const updatedMultiples = returnData.map((data, i) => {
                    const inputToken = filteredTokens[i].inputToken
                    const info = ethers.utils.defaultAbiCoder.decode(['uint', 'uint'], data)
                    const lpTokensCreated = info[1]
                    return {
                        inputToken,
                        issuerToken: filteredTokens[i].issuerToken,
                        tilter: filteredTokens[i].tilter,
                        priceMultiple: lpTokensCreated,
                    }
                })
                const updatedFromOriginal = updateArray(inputTilterReferencePairs, updatedMultiples)
                setPriceMultipleTokenTilterPairs(updatedFromOriginal)
                // } catch { throw 'multi call fails on refValueOfTilt for calls ' + JSON.stringify(calls) }
            })().catch(error => {
                throw `In usePriceMultiples: tilter addresses ${JSON.stringify(tilterAddresses, null, 4)}`
            })
        }
    }, [contracts, inputTilterReferencePairs])
    return priceMultipleTokenTilterPairs
}

const useTokenInfo = (contracts: Contracts | undefined, priceMultiples: TokenTilterPair[] | undefined, blockNumber: number): TokenInfoFlat[] | undefined => {
    const [flatTokenInfo, setFlatTokenInfo] = useState<TokenInfoFlat[] | undefined>()
    const [updateStalePrice, setUpdateStalePrice] = useState<number>(0)
    const [lastBlockUpdated, setLastBlockUpdated] = useState<number>(0)
    useEffect(() => {
        if (blockNumber && blockNumber - lastBlockUpdated > 50) {
            setUpdateStalePrice(updateStalePrice + 1)
            setLastBlockUpdated(blockNumber)
            console.log(`Block ${blockNumber}: updating stale price`)
        }
    }, [blockNumber])


    useDeepCompareEffect(() => {
        if (priceMultiples && contracts && contracts.issuer) {
            (async () => {
                const calls = priceMultiples
                    .map(t => ({
                        target: contracts.issuer.address,
                        callData: contracts.issuer.interface.encodeFunctionData("whitelist", [t.issuerToken])
                    }));
                try {
                    const { blockNumber, returnData } = await contracts.multicall3.callStatic.aggregate(calls)
                    const flatInfo: TokenInfoFlat[] = returnData.map((data, i) => {
                        const indexToken = priceMultiples[i].inputToken
                        const info = ethers.utils.defaultAbiCoder.decode(
                            ['bool', 'bool', 'uint256', 'uint256', 'bool'],
                            data
                        );
                        const flatInfo: TokenInfoFlat = {
                            input: indexToken,
                            enabled: info[0],
                            burnable: info[1],
                            lastminted_timestamp: info[2],
                            teraCouponPerTokenPerSecond: info[3],
                            rewardEnabled: info[4]
                        }
                        return flatInfo
                    })
                    console.log('onchain prices fetched')
                    setFlatTokenInfo(flatInfo)
                } catch { console.log('multicall failed on whitelist') }
            })().catch(error => {
                throw "In useTokenInfo: " + error
            })
        }
    }, [priceMultiples, updateStalePrice])
    return flatTokenInfo
}

//This is a hurricane of abstraction <insert harold gif>
const useMultiTokenInfo = (contracts: Contracts | undefined,
    tokens: string[] | undefined,
    refresh: number): TokenFeatureMap | undefined => {
    const signer = useEthersSigner()
    const [info, setInfo] = useState<TokenFeatureMap>()
    const { data: blockNumber } = useBlockNumber()
    const [halfSeconds, setHalfSeconds] = useState(0);

    const inputTilterPairs = useMultiTilterMapping(contracts, tokens, signer, refresh)
    const inputTilterReferencePairs = useReferencePair(contracts, inputTilterPairs);

    //1 ether for non tilters
    const priceMultiple: TokenTilterPair[] | undefined = usePriceMultiples(contracts, inputTilterReferencePairs);
    const tokenInfoFlat: TokenInfoFlat[] | undefined = useTokenInfo(contracts, priceMultiple, Number(blockNumber) || 0);


    useDeepCompareEffect(() => {

        //merge tokenInfo and priceMultiple to create tokenFeatures
        //generate map as per below
        //setInfo
        if (tokenInfoFlat && tokenInfoFlat.length > 0 && priceMultiple && contracts && blockNumber) {
            const finalMap: TokenFeatureMap = {}
            tokenInfoFlat.forEach((t) => {
                const matchingPriceMultiple = priceMultiple.find(m => m.inputToken == t.input)
                if (!matchingPriceMultiple)
                    throw "UI error: useDynamicTokenInfo algorithm should have eliminated nulls"
                const newTera = t.teraCouponPerTokenPerSecond.mul(matchingPriceMultiple.priceMultiple).div(ONE)
                const { burnable, enabled, lastminted_timestamp, rewardEnabled } = t
                const issuer = matchingPriceMultiple.tilter === undefined ? contracts.issuer : matchingPriceMultiple.tilter
                let feature: TokenFeatures = {
                    currentPrice: BigNumber.from(0),
                    burnable,
                    enabled,
                    lastminted_timestamp,
                    teraCouponPerTokenPerSecond: newTera,
                    issue: issuer.issue,
                    issuerToApprove: issuer.address,
                    rewardEnabled
                }
                const currentPrice = getPrice(feature)
                feature.currentPrice = currentPrice
                finalMap[t.input] = feature
            })

            setInfo(finalMap)
        }
    }, [tokenInfoFlat])


    //multi for getting issuer token for tilting using Uni
    //multi for getting LP_Q generated by tilting.
    //multi for getting tera on issuer token.
    //use above 2 to infer tera for input token
    //use inputTilterPairs to map issuerFunction


    useEffect(() => {
        setTimeout(() => setHalfSeconds(halfSeconds + 1), 500)
    }, [halfSeconds])

    useEffect(() => {
        // Set up the interval

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

        // Clear interval on component unmount

    }, [halfSeconds]);
    return info
}

const useMultiTokenBalances = (multicall3: Multicall3 | undefined, holder: string | undefined, tokens: string[] | undefined, weth: string | undefined, refreshCount: number): Record<string, BigNumber> | undefined => {
    const signer = useEthersSigner()
    const [balances, setBalances] = useState<Record<string, BigNumber> | undefined>()
    const [refreshing, setRefreshing]= useState<boolean>(false)
    const ethBalance = useEthBalance(holder)
    const { data: blockNumber } = useBlockNumber()

    useEffect(()=>{
        setRefreshing(true)
    },[refreshCount])

    useDeepCompareEffect(() => {
        if (signer && holder && tokens && multicall3 && ethBalance && weth &&  (refreshing ||Number(blockNumber) % 3 === 0)) {

            (async () => {
                const wethless = tokens.filter(t => t.toLowerCase() != weth.toLowerCase())
                const calls = wethless.map(tokenAddress => {
                    const tokenContract = new ethers.Contract(tokenAddress, ABIs.ERC20, signer);
                    return {
                        target: tokenAddress,
                        callData: tokenContract.interface.encodeFunctionData('balanceOf', [holder])
                    };
                });

                const { blockNumber, returnData } = await multicall3.callStatic.aggregate(calls);
                const tokenBalances = (returnData.map((data, i) => ({ address: wethless[i], balance: ethers.utils.defaultAbiCoder.decode(['uint256'], data)[0] }))
                    .reduce((acc, current) => {
                        acc[current.address] = current.balance;
                        return acc;
                    }, {} as Record<string, BigNumber>))
                //   if (wethless.length < tokens.length) {
                tokenBalances[weth] = ethBalance
                // }
                setBalances(tokenBalances)
            })()
            setRefreshing(false)
        }
    }, [signer, multicall3, refreshCount, blockNumber])

    return balances;
};

export interface IssueSignature {
    (inputToken: string, amount: BigNumber, recipient: string, overrides?: PayableOverrides & { from?: string }): Promise<any>
}

export interface DynamicTokenInfo {
    balance: BigNumber
    burnable: boolean
    teraCouponPerToken: BigNumber
    issue: IssueSignature,
    issuerToApprove: string
    rewardEnabled: boolean
}
type DynamicInfoMap = Record<string, DynamicTokenInfo>
export const useDynamicTokenInfo = (contracts: Contracts | undefined, account: string | undefined, addresses: OptionalAddresses, refresh: number): DynamicInfoMap | undefined => {
    const tokens = addresses?.Inputs
    const [dynamicInfo, setDynamicInfo] = useState<DynamicInfoMap>()

    const tokenInfo = useMultiTokenInfo(contracts, tokens, refresh)
    const balances = useMultiTokenBalances(contracts?.multicall3, account, tokens, addresses?.Weth, refresh)

    useEffect(() => {
        if (balances && tokenInfo && tokens) {

            setDynamicInfo(tokens.map(t => t.toLowerCase()).map(token => {
                const info: DynamicTokenInfo = {
                    balance: balances[token],
                    burnable: tokenInfo[token].burnable,
                    teraCouponPerToken: tokenInfo[token].currentPrice,
                    issue: tokenInfo[token].issue,
                    issuerToApprove: tokenInfo[token].issuerToApprove,
                    rewardEnabled: tokenInfo[token].rewardEnabled
                }
                return { token, info }
            }).reduce((acc, current) => {
                acc[current.token.toLowerCase()] = current.info
                return acc
            }, {} as DynamicInfoMap))
        }
    }, [tokenInfo, balances, refresh])


    return dynamicInfo
}


