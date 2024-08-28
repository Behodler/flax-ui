import { BigNumber, Contract } from "ethers"
import { useEffect, useState } from "react"
import { ERC20, Issuer } from "../typechain/types/ethers"
import { useDeepCompareEffect } from "./useDeepCompareEffect"
import { useEthersSigner } from "./useEthersProvider"
import ABIs from "../constants/ABIs.json"

export interface RewardConfig {
    token:ERC20|undefined,
    minFlax:BigNumber,
    rewardSize:BigNumber
}

export const defaultRewardConfig:RewardConfig = {token:undefined,minFlax:BigNumber.from(0),rewardSize:BigNumber.from(0)}


export const useRewardConfig = (issuer:Issuer|undefined,refresh:number) =>{
    const [rewardConfig,setRewardConfig] = useState<RewardConfig>(defaultRewardConfig)
    const signer = useEthersSigner()

    useDeepCompareEffect(()=>{
        if(issuer && signer){   
        (async()=>{
            const {token,minFlaxMintThreshold,rewardSize} = await issuer.customTokenReward()
            const tokenERC20 = new Contract(
                token,
                ABIs.ERC20,
                signer
            ) as unknown as ERC20
            setRewardConfig({
                token:tokenERC20,
                rewardSize,
                minFlax:minFlaxMintThreshold
            })
        })()
    }
    },[issuer,refresh,signer])

    return rewardConfig
}