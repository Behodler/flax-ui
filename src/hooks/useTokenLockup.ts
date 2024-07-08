import { useContractFunction, useEthers } from '@usedapp/core';
import { HedgeyAdapter, TokenLockupPlans } from "../typechain/types/ethers";  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';
import { useProvider } from './useProvider';
import { useEffect, useMemo, useState } from 'react';


//Never import this directly. Call the blockchain context
const useTokenLockUpPlans = (hedgey:HedgeyAdapter|undefined): TokenLockupPlans | undefined => {
    const provider = useProvider();
    const [tokenLockupPlan,setTokenLockupPlan] = useState<TokenLockupPlans>()
    
    useEffect(()=>{
        if(provider && hedgey){
            const fetchLockup = async()=>{
                const tokenLockupAddress = await hedgey.tokenLockupPlan();
                const lockupPlan = new Contract(tokenLockupAddress,ABIs.TokenLockupPlans,provider.getSigner()) as unknown as TokenLockupPlans
                setTokenLockupPlan(lockupPlan);
            }
            fetchLockup()
        }
    },[hedgey])
    // Create a Contract instance and assert the correct type
  
    return tokenLockupPlan
};

export default useTokenLockUpPlans