import { Contracts } from "../contexts/BlockchainContextProvider";
import { ChainID } from "../types/ChainID";

//allows components to avoid endless null checks
export interface LiveProps{
    contracts:Contracts
    account:string,
    chainId:ChainID
}