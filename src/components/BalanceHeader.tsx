import React, { useEffect, useState } from 'react';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import Flax from "../images/FlaxSmall.png"
import HedgeyIcon from "../images/hedgeyIcon.png"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useEthers, useBlockNumber } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import { LiveProps } from '../extensions/LiveProps';
import { useProvider } from '../hooks/useProvider';
import { ChainID } from '../types/ChainID';
import { getDaiPriceOfToken, getEthPrice } from '../extensions/Uniswap';



const BalanceHeader = (props: LiveProps) => {
    const { account, contracts } = props
    const [balance, setBalance] = useState<string>("0.0")
    const [lockedBalance, setLockedBalance] = useState<string>();
    const blockNumber = useBlockNumber();
    const { chainId, daiPriceOfEth, setFlxDollarPrice, flxDollarPrice } = useBlockchainContext()
    const [flaxPrice, setFlaxPrice] = useState<string>()
    const ethProvider = useProvider();

    useEffect(() => {
        if (ethProvider && chainId === ChainID.mainnet) {
            const fetchDaiPrice = async () => {
                const ethPriceOfFLX = await getEthPrice('0x0cf758D4303295C43CD95e1232f0101ADb3DA9E8', ethProvider, [])
                if (daiPriceOfEth && ethPriceOfFLX) {

                    const daiPrice = daiPriceOfEth.mul(ethPriceOfFLX).div(ethers.constants.WeiPerEther)
                    setFlxDollarPrice(daiPrice || BigNumber.from('0000000000000000'))
                    if (daiPrice) {
                        const formatted = parseFloat(ethers.utils.formatEther(daiPrice)).toFixed(2)
                        setFlaxPrice(formatted)
                    }
                } else {
                    setFlaxPrice(undefined)
                }
            }
            fetchDaiPrice();
        }

    }, [blockNumber, chainId, ethProvider, daiPriceOfEth])


    useEffect(() => {
        const fetchBalance = async () => {
            if (account && contracts && contracts.coupon) {
                try {
                    const balanceValue = await contracts.coupon.balanceOf(account);
                    const formattedBalance = ethers.utils.formatEther(balanceValue);
                    const balanceFixed = parseFloat(formattedBalance).toFixed(4); // Ensure it always has 4 decimal places
                    setBalance(balanceFixed);
                } catch (error) {
                    //console.error('Failed to fetch balance:', error);
                }
            }
        };

        fetchBalance();

        const fetchLockupBalance = async () => {
            try {


                if (account && contracts && contracts.tokenLockup) {
                    const balance = await contracts.tokenLockup.lockedBalances(account, contracts.coupon.address)

                    const formattedBalance = ethers.utils.formatEther(balance)
                    const balanceFixed = parseFloat(formattedBalance).toFixed(4); // Ensure it always has 4 decimal places
                    setLockedBalance(balanceFixed);
                }
            } catch { }
        }
        fetchLockupBalance()
    }, [account, blockNumber, contracts]); // Re-run when account or block number changes

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Grid item style={{ marginBottom: '12px' }}>
                <Typography variant="h5" style={{ color: '#DAA520' }}>
                    Balance
                </Typography>
            </Grid>
            <Grid item style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <a href="https://etherscan.io/token/0x0cf758d4303295c43cd95e1232f0101adb3da9e8" target='_blank'>
                    <Tooltip title="Flax (FLX)" placement="left">
                        <Box component="img" src={Flax} alt="Balance Icon" sx={{ height: '40px', width: '40px', marginRight: '10px', cursor: 'pointer' }} />
                    </Tooltip>
                </a>
                <Typography variant="h2">
                    {balance}
                </Typography>
                {lockedBalance === "0.0000" ? <></> :
                    <a href="https://app.hedgey.finance/investor-lockups" target='_blank'>
                        <Tooltip title={`${lockedBalance} FLX locked on Hedgey Finance`} placement="left">
                            <Box component="img" src={HedgeyIcon} alt="Balance Icon" sx={{ height: '15px', width: '15px', marginLeft: '10px', cursor: 'pointer', border: "2px solid white", borderRadius: "3px", padding: "4px" }} />
                        </Tooltip>
                    </a>
                }
            </Grid>
            {flaxPrice ?
                <Grid item>
                    <Tooltip title="This is the current Uniswap V2 price">
                        <Typography variant="h5" style={{ color: '#00A36C' }}>
                            ${flaxPrice}
                        </Typography>
                    </Tooltip>
                </Grid> : <Grid item>
                    <Tooltip title="This is just a fictional testnet price">
                        <Typography variant="h5" style={{ color: '#00A36C' }}>
                            ${ethers.utils.formatEther(flxDollarPrice.toString())}0
                        </Typography>
                    </Tooltip>
                </Grid>}

        </Grid>
    );
};

export default BalanceHeader;
