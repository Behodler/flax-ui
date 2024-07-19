import { BigNumber, ethers } from "ethers";
import { TokenLockupConfig } from "../contexts/BlockchainContextProvider";

export function TeraToString(teraFlaxPerInput: BigNumber): string {
    return `${parseFloat(BigNumber.from(teraFlaxPerInput).div(
        1000_000
    ).toString()) / 1000_000}`
}

export const isEthAddress = (address: string | undefined) => {
    if (!address)
        return false
    // Regex to check if the address is exactly 42 characters long, starts with '0x', followed by exactly 40 hexadecimal characters.
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}

/*
uint lockupDuration = lockupConfig.offset +
            (coupons / (lockupConfig.threshold_size * (1 ether))) *
            lockupConfig.days_multiple;
*/
export const calculateLockupDuration = (flax_wei: BigNumber, config: TokenLockupConfig): number => {
    const multiples = (flax_wei.div(ethers.constants.WeiPerEther.mul(config.threshold_size))).toNumber();
    const lockupTime = config.offset + multiples * config.days_multiple
    return lockupTime
}