import _ from "lodash"
import { useEffect, useState } from "react"
import { defaultLockup, TokenLockupConfig } from "../contexts/BlockchainContextProvider"
import { Issuer } from "../typechain/types/ethers"

export const useTokenLockupConfig = (issuer: Issuer | undefined) => {
    const [tokenLockupConfig, setTokenLockupConfig] = useState<TokenLockupConfig>(defaultLockup)
    useEffect(() => {
        if (issuer) {
            (async () => {
                const { threshold_size: threshold_sizeBig, offset: offsetBig, days_multiple: days_multipleBig } = await issuer.lockupConfig()
                const threshold_size = threshold_sizeBig.toNumber()
                const offset = offsetBig.toNumber()
                const days_multiple = days_multipleBig.toNumber()
                const newConfig: TokenLockupConfig = { threshold_size, offset, days_multiple }
                if (!_.isEqual(tokenLockupConfig, newConfig)) {
                    setTokenLockupConfig(newConfig)
                }

            })()
        }
    }, [issuer])
    return tokenLockupConfig
}