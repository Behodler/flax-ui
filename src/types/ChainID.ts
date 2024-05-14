export enum ChainID {
    absent =-1,
    disconnected =0,
    mainnet=1,
    anvil =31337,
    unsupported
}

const supportedChains:ChainID[] = [ChainID.mainnet,ChainID.anvil]

export const supportedChain = (id:ChainID):boolean=>{
    return supportedChains.find(chain=>chain===id)!==undefined
}