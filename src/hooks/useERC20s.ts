import { useBlockNumber, useEthers } from '@usedapp/core';
import {  ERC20 } from '../typechain/types/ethers';  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../constants/ABIs.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { ContractAddresses } from '../types/ContractAddresses';

import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useEthersSigner } from './useEthersProvider';

const useERC20s = (addresses: ContractAddresses | null): ERC20[] | undefined => {
    const signer = useEthersSigner();
    const addressesString = JSON.stringify(addresses)
    const { account } = useEthers()
    const blockNumber = useBlockNumber()
    const [erc20s, setErc20s] = useState<ERC20[]>([])

    useEffect(() => {
        if (addresses && addresses.Inputs && signer) {

            const newERC20s = addresses.Inputs.map(address => {
                return new Contract(
                    address,
                    ABIs.Coupon,
                    signer
                ) as unknown as ERC20
            });
            if (!_.isEqual(newERC20s, erc20s)) {
                setErc20s(newERC20s)
            }
        }
    }, [addresses, signer, addressesString]); // Dependency array

    return erc20s
};


export default useERC20s