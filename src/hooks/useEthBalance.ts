import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import { useEthersProvider, useEthersSigner } from './useEthersProvider';
import { useBalance } from 'wagmi'
import { useBlockchainContext, useInejctedBalance } from '../contexts/BlockchainContextProvider';

const useEthBalance = (account: string | undefined): BigNumber | undefined => {
    const [balance, setBalance] = useState<BigNumber | undefined>();
    const signer = useEthersSigner();
    const provider = useEthersProvider()
    const blockNumber = useBlockNumber()
    const { ethWindow } = useBlockchainContext()

    const val = useInejctedBalance(account)

    useEffect(()=>{
        if (val)
            setBalance(val)
    },[val])


    useEffect(() => {
        const fetchBalance = async () => {
            if (provider && account) {

                try {
                    if (!ethWindow) {
        
                        setBalance(await provider.getBalance(account));


                    }

                } catch (err) {
                    console.error(err);
                }
            }
        };

        if (account) {
            fetchBalance();
        }
    }, [signer, account, blockNumber]);

    return balance;
};

export default useEthBalance;
