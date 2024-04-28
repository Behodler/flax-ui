import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";

export function useProvider():ethers.providers.Web3Provider{
const {library} = useEthers()
return  library as ethers.providers.Web3Provider
}