import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useProvider } from './useProvider'; // Adjust the import path as necessary

const useEthBalance = (account: string | undefined): BigNumber | undefined => {
    const [balance, setBalance] = useState<BigNumber | undefined>();
    const provider = useProvider();

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
    }, [provider, account]);

    return balance;
};

export default useEthBalance;
