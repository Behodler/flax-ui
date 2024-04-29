import React, { useEffect, useState } from 'react';
import './App.css';
import { Contracts, useBlockchainContext } from './contexts/BlockchainContextProvider';
import useCoupon from './hooks/useCoupon';
import { TransactionState, useContractFunction, useEthers } from '@usedapp/core';
import { Contract, ContractTransaction } from 'ethers';
import { ControlCamera } from '@mui/icons-material';
import { Broadcast, TransactionProgress } from './extensions/Broadcast';

const progressTextMapper = (progress: TransactionProgress) => {
  switch (progress) {
    case TransactionProgress.dormant: return "Dormant"
    case TransactionProgress.confirmed: return "Confirmed"
    case TransactionProgress.rejected: return "Rejected"
    case TransactionProgress.failed: return "Failed"
    case TransactionProgress.signed: return "Signed"
    case TransactionProgress.triggered: return "Triggered"
  }
}

function App() {
  const { contracts, account } = useBlockchainContext()
  const [info, setInfo] = useState<string[]>([])
  const [minterTXProgress, setMinterTxProgress] = useState<TransactionProgress>(TransactionProgress.dormant)
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


  function DoSomething() {
    Broadcast(contracts.coupon.setMinter(account, true), setMinterTxProgress, 5)

  }
  return (
    <div className="App">
      <h2>{progressTextMapper(minterTXProgress)}</h2>
      {info.length > 0 ? JSON.stringify(info, null, 4) : "nothing loaded"}
      <input type="button" onClick={DoSomething} value="setMinter to self" />
    </div>

  );
}

export default App;
