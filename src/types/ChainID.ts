export enum ChainID {
    absent = -1,
    disconnected = 0,
    mainnet = 1,
    anvil = 31337,
    sepolia = 11155111,
    unsupported
}

const supportedChains: ChainID[] = [ ChainID.anvil, ChainID.sepolia, ChainID.mainnet]

export const supportedChain = (id: ChainID): boolean => {
    return supportedChains.find(chain => chain === id) !== undefined
}