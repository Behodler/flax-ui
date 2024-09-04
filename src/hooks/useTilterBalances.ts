import { Coupon, Multicall3, TilterFactory } from "../typechain/types/ethers"

import tilterInputs from '../constants/admin/TilterInputs.json'
import { BigNumber, ethers } from "ethers"
import { ChainID } from "../types/ChainID"
import assetListJSON from "../constants/AssetLists.json"
import { Assets } from "../types/Assets"
import { useEffect, useMemo, useState } from "react"
import _ from "lodash"

interface TilterInputType {
    [key: string]: string[]
}

const inputs = tilterInputs as TilterInputType
const assets = assetListJSON as Assets

export const useTilterBalances = (chainId: ChainID, flax: Coupon | undefined, tilterFactory: TilterFactory | undefined, multicall3: Multicall3 | undefined, accountIsOwner: boolean): Record<string, string> => {
    const [balanceMap, setBalanceMap] = useState<Record<string, string>>({})
    useEffect(() => {

        if (chainId > 0 && accountIsOwner && tilterFactory && multicall3 && flax) {
            const friendlies: string[] = inputs[chainId]
            const assetList = assets[chainId]

            const referenceAddresses = assetList.filter(a => friendlies.findIndex(f => a.friendlyName === f) !== -1)
                .map(asset => asset.address)


            const getTilterCalls = referenceAddresses.map(ref => ({
                target: tilterFactory.address,
                callData: tilterFactory.interface.encodeFunctionData('tiltersByRef', [ref])

            }));

            (async () => {
                let multiCallReturn = await multicall3.callStatic.aggregate(getTilterCalls)
                const tilterMap = (
                    multiCallReturn.returnData.map((data, i) => ({
                        address: referenceAddresses[i],
                        tilter: ethers.utils.defaultAbiCoder.decode(['address'], data)[0]
                    })).reduce((acc, current) => {
                        acc[current.address] = current.tilter
                        return acc
                    }, {} as Record<string, string>)
                )

                //Now we want the coupon balance of every tilter
                const getTilterBalanceCalls = referenceAddresses.map(ref => ({
                    target: flax.address,
                    callData: flax.interface.encodeFunctionData("balanceOf", [tilterMap[ref]])
                }))
                multiCallReturn = await multicall3.callStatic.aggregate(getTilterBalanceCalls)

                const inputTilterBalanceMap = multiCallReturn.returnData.map((data, i) => ({
                    address: referenceAddresses[i],
                    tilterBalance: ethers.utils.defaultAbiCoder.decode(['address'], data)[0]
                })).reduce((acc, current) => {
                    acc[current.address] = current.tilterBalance
                    return acc
                }, {} as Record<string, string>)
                if (!_.isEqual(inputTilterBalanceMap, balanceMap)) {
                    setBalanceMap(inputTilterBalanceMap)
                }
            })()
        }

    }, [chainId, accountIsOwner, tilterFactory, multicall3])
    return balanceMap
}
