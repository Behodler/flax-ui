import { BigNumber, Contract, ethers } from "ethers"
import { useState, useEffect } from "react"
import {  ERC20 } from "../typechain/types/ethers"
import { useBlockNumber } from "@usedapp/core"


export const useCustomRewardBalance = (issuerAddress: string | undefined, token: ERC20 | undefined, refresh: number) => {
    const [customRewardBalance, setCustomRewardBalance] = useState<BigNumber>(BigNumber.from(0))
    const[rewardTokenName,setRewardTokenName] = useState<string>('')

    const blockNumber = useBlockNumber()
    const [localRefresh, setLocalRefresh] = useState<number>(0)

    useEffect(() => {
        if (!blockNumber || (blockNumber % 5 === 0) || refresh > localRefresh) {
            setLocalRefresh(localRefresh + 1)
        }
    }, [blockNumber, refresh])

    useEffect(() => {
        if (token && issuerAddress) {
            (async () => {
                setCustomRewardBalance(await token.balanceOf(issuerAddress))
                setRewardTokenName(await token.symbol())
            })()
        }
    }, [token, issuerAddress, localRefresh])
    return {customRewardBalance,rewardTokenName}
}