import { BigNumber, ethers } from "ethers";
import { TokenLockupConfig } from "../contexts/BlockchainContextProvider";
import assetList from '../constants/AssetLists.json'
import { AssetProps, Assets } from "../types/Assets";
import { ChainID } from "../types/ChainID";
export function TeraToString(teraFlaxPerInput: BigNumber, places: number): string {
    return `${(parseFloat(BigNumber.from(teraFlaxPerInput).div(
        1
    ).toString()) / 1000_000_000_000).toFixed(places)}`
}

export const isEthAddress = (address: string | undefined) => {
    if (!address)
        return false
    // Regex to check if the address is exactly 42 characters long, starts with '0x', followed by exactly 40 hexadecimal characters.
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}


export const calculateLockupDuration = (flax_wei: BigNumber, config: TokenLockupConfig): number => {
    const multiples = (flax_wei.div(ethers.constants.WeiPerEther.mul(config.threshold_size))).toNumber();
    const lockupTime = config.offset + multiples * config.days_multiple
    return lockupTime
}

export const isTiltingTokenFactory = (chainId: ChainID) => (address: string): boolean => {
    if (!chainId)
        return false
    const assets = assetList as Assets
    const chain = assets[chainId]
    if (!chain)
        return false

    const asset = chain.find(asset => asset.address === address) as AssetProps
    if (asset) {
        return asset.category === 'BlueChip' || asset.category === 'Meme'
    }
    return false
}


export const ONE = ethers.constants.WeiPerEther


const isTilter = (name: string) => name === 'Ether' || name === 'Uni' || name === 'Shib'

export const priceBuffer = (tokenAddress: string): boolean => {
    let bufferRequired: boolean = false
    let assets: Assets = assetList as Assets
    Object.keys(assets).forEach((chain) => {
        let currentChain = assets[chain]
        currentChain.forEach(assetGroup => {
            if (assetGroup.address.toLowerCase() === tokenAddress) {
                if (isTilter(assetGroup.friendlyName))
                    bufferRequired = true
            }
        })

    })
    return bufferRequired
}