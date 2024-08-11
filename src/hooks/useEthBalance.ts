import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useProvider } from './useProvider'; // Adjust the import path as necessary
import { useBlockNumber } from '@usedapp/core';

const useEthBalance = (account: string | undefined): BigNumber | undefined => {
    const [balance, setBalance] = useState<BigNumber | undefined>();
    const provider = useProvider();
    const blockNumber = useBlockNumber()

    useEffect(() => {
        const fetchBalance = async () => {
            if (provider && account) {

                try {
                    const balance = await provider.getBalance(account);
                    setBalance(balance);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        if (account) {
            fetchBalance();
        }
    }, [provider, account, blockNumber]);

    return balance;
};

export default useEthBalance;
