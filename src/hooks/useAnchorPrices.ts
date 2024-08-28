import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { ContractAddresses } from "../types/ContractAddresses"
import { OptionalAddresses } from "./useAddresses"

export const useAnchorPrices = (inputDollarPrices:Record<string,BigNumber>|undefined,addresses:OptionalAddresses)=>{
    const [daiPriceOfEth, setDaiPriceOfEth] = useState<BigNumber | undefined>()
    const [flxDollarPrice, setFlxDollarPrice] = useState<BigNumber>(BigNumber.from('100000000000000000'))
  
    useEffect(() => {
        if (inputDollarPrices && addresses) {
            const wethPrice = inputDollarPrices[addresses.Weth]
            if (wethPrice) {
                setDaiPriceOfEth(wethPrice)
            }

            const flaxPrice = inputDollarPrices[addresses.Coupon.toLowerCase()]
            console.log('flaxPrice ' + flaxPrice.toString())
            if (flaxPrice)
                setFlxDollarPrice(flaxPrice)

        }
    }, [inputDollarPrices])
    return {daiPriceOfEth,flxDollarPrice}
}