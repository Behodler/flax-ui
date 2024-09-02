import { useState, useEffect } from 'react';
import { ContractAddresses } from '../types/ContractAddresses';
import useCoupon from './useCoupon';
import useIssuer from './useIssuer';
import useFaucet from './useFaucet';
import useERC20s from './useERC20s';
import { Contracts } from '../contexts/BlockchainContextProvider';
import _ from 'lodash'
import useHedgey from './useHedgey';
import useTokenLockUpPlans from './useTokenLockup';
import useMulticall3 from './useMulticall3';
import { useTilterFactory } from './useTilter';
import { useUniswap } from './useUniswap';
import useUniPriceFetcher from './useUniPriceFetcher';
import { BigNumber } from 'ethers';
// Custom hook to manage contracts based on addresses
export function useContracts(addresses: ContractAddresses | null,account:string |undefined): {contracts: Contracts | undefined,accountIsOwner:boolean,couponBalanceOfIssuer:BigNumber} {
    const [contracts, setContracts] = useState<Contracts | undefined>();
    const [accountIsOwner,setAccountIsOwner] = useState<boolean>(false)
    const [couponBalanceOfIssuer,setCouponBalanceOfIssuer] = useState<BigNumber>(BigNumber.from(0))
    const coupon = useCoupon(addresses);
    const issuer = useIssuer(addresses);
    const inputs = useERC20s(addresses);
    const faucet = useFaucet(addresses);
    const hedgey = useHedgey(addresses);
    const uni = useUniswap(addresses)
    const uniPriceFetcher = useUniPriceFetcher(addresses)
    const tilterFactory = useTilterFactory(addresses)
    const tokenLockup = useTokenLockUpPlans(hedgey);
    const multicall3 = useMulticall3(addresses);

    useEffect(()=>{
        if(account && issuer){
            (async ()=>{
               const owner = (await issuer.owner()).toLowerCase()
               setAccountIsOwner(account.toLowerCase()===owner) 
            })()
        }
    },[issuer,account])

    useEffect(()=>{
        if(coupon && issuer){
            (async ()=>{
                const balance = await coupon.balanceOf(issuer.address)
                setCouponBalanceOfIssuer(balance) 
             })()
        }
    },[coupon,issuer])

    if (coupon && issuer && hedgey && tokenLockup && multicall3 && tilterFactory && inputs && uni && uniPriceFetcher) {
        const newContracts: Contracts = { coupon, issuer, inputs, faucet, hedgey, tokenLockup, multicall3, tilterFactory, uniPriceFetcher, uniswapFactory: uni.factory, uniswapRouter: uni.router }
        const isNew: boolean = !_.isEqual(newContracts, contracts)
        if (isNew)
            setContracts({ coupon, issuer, inputs, faucet, tilterFactory, hedgey, tokenLockup, multicall3, uniswapFactory: uni.factory, uniswapRouter: uni.router, uniPriceFetcher });
    }
    return {contracts,accountIsOwner,couponBalanceOfIssuer};
}
