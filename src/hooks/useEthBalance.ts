import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import { useEthersProvider, useEthersSigner } from './useEthersProvider';

const useEthBalance = (account: string | undefined): BigNumber | undefined => {
    const [balance, setBalance] = useState<BigNumber | undefined>();
    const signer = useEthersSigner();
    const provider = useEthersProvider()
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
    }, [signer, account, blockNumber]);

    return balance;
};

export default useEthBalance;
