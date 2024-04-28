import React, { useEffect, useState } from 'react';
import './App.css';
import { Contracts, useBlockchainContext } from './contexts/BlockchainContextProvider';
import useCoupon from './hooks/useCoupon';
import { TransactionState, useContractFunction, useEthers } from '@usedapp/core';
import { Contract, ContractTransaction } from 'ethers';
import { ControlCamera } from '@mui/icons-material';
import Broadcast from './extensions/Broadcast';

function App() {
  const { contracts, account } = useBlockchainContext()
  const [info, setInfo] = useState<string[]>([])

  useEffect(() => {
    if (account) {
      const getNames = async (contracts: Contracts) => {

        const balance = await contracts.coupon.balanceOf(account)
        const owner = await contracts.coupon.owner()

        const couponName = await contracts.coupon.name()
        const max = await contracts.issuer.MaxIssuancePerDay()
        const namesOfTokens = await Promise.all(contracts.inputs.map(async input => {
          return await input.name()
        }))
        setInfo([couponName, balance.toString(), owner, max.toString(), ...namesOfTokens])
      }
      getNames(contracts)
    }
  }, [contracts])

  useEffect(() => {
    console.log('contracts changed')
  }, [contracts])

  const onInitiate = () => console.log('Button Clicked')
  const onSign = () => console.log('Metamask signed')
  const onConfirm = () => console.log('TX Confirmed')
  const onFail = () => console.log('Tx failed')
  const onReject = () => console.log('Metamask rejected')
  function DoSomething() {
    Broadcast(contracts.coupon.mint(10000, account), onInitiate, onSign, onConfirm, onReject, onFail)


  }
  return (
    <div className="App">

      {info.length > 0 ? JSON.stringify(info, null, 4) : "nothing loaded"}
      <input type="button" onClick={DoSomething} value="setMinter to self" />
    </div>

  );
}

export default App;
