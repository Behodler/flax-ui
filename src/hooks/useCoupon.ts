import { useContractFunction, useEthers } from '@usedapp/core';
import { Coupon } from '../../types/ethers/Coupon';  // Import TypeChain-generated type
import { ethers, Contract } from 'ethers';
import ABIs from "../../ABIs.json"

const useCoupon = () => {
  const { library } = useEthers();
  const couponAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

  if (!library) throw Error("Provider not initialized");

  // Create a Contract instance and assert the correct type
  const couponContract = new Contract(
    couponAddress,
    ABIs.Coupon,
    library.getSigner()
  ) as unknown as Coupon;  // Type assertion here

  // Now you can use couponContract as a Coupon instance with all methods strongly typed
  return couponContract;
};

export default useCoupon