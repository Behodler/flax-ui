import { BigNumber, ethers } from "ethers";

export function TeraToString(teraFlaxPerInput: BigNumber): string {
    return `${parseFloat(BigNumber.from(teraFlaxPerInput).div(
        1000_000
    ).toString())/1000_000}`
}