import { Contract, ethers } from 'ethers';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useMemo } from 'react';
import { Multicall3 } from '../typechain/types/ethers';
import ABIs from "../constants/ABIs.json"

const useMulticall3 = (addresses:ContractAddresses | null):Multicall3|undefined=>{
  const provider = useProvider();

  
    // Create a Contract instance and assert the correct type
    return useMemo(() => {
        if (provider && addresses && addresses.Multicall3) {
            const multicall3Contract = new Contract(
                addresses.Multicall3,
                ABIs.Multicall3,
                provider.getSigner()
            ) as unknown as Multicall3;  // Type assertion here

            // Now you can use multicall3Contract as a Multicall3 instance with all methods strongly typed
            return multicall3Contract;
        }
        return undefined
    }, [provider, addresses])
};

export default useMulticall3