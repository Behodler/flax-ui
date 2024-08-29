import { useAccount, useChainId } from "wagmi"
import { ChainID, supportedChain } from "../types/ChainID"
import { useState, useEffect } from "react"
import { useDeepCompareEffect } from "./useDeepCompareEffect"


export const useDerivedChainId = (setRefresh: (val: number) => void, refresh: number): { account: string | undefined, derivedChainId: ChainID } => {
    const wagmiChainID = useChainId()
    const wagmiAccount = useAccount()
    const [derivedChainId, setDerivedChainId] = useState<ChainID>(ChainID.absent)

    useDeepCompareEffect(() => {

        if (wagmiChainID) {

            if (wagmiAccount.isConnected) {
                if (wagmiAccount.address !== localStorage.accountAddress) {
                    localStorage.accountAddress = wagmiAccount.address
                    window.location.reload()
                }
                // const currentAccount = localStorage.accountAddress

                if (supportedChain(wagmiChainID)) {
                    const currentSupportedChain = localStorage.supportedChain
                    if (currentSupportedChain != wagmiChainID) {
                        localStorage.supportedChain = wagmiChainID
                        window.location.reload()
                    }

                    setDerivedChainId(wagmiChainID)
                    setTimeout(() => { console.log('refreshing'); setRefresh(refresh + 5) }, 12000)
                }
                else {
                    setDerivedChainId(ChainID.unsupported)
                }
            }
            else {
                setDerivedChainId(ChainID.disconnected)
            }
        } else {
            setDerivedChainId(ChainID.absent)
        }
    }, [wagmiChainID, wagmiAccount])

    return { account: wagmiAccount.address, derivedChainId }
}