import React, { useEffect, useState } from 'react';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import Flax from "../images/FlaxSmall.png"
import HedgeyIcon from "../images/hedgeyIcon.png"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useEthers, useBlockNumber } from '@usedapp/core';
import { ethers } from 'ethers';
import { LiveProps } from '../extensions/LiveProps';



const BalanceHeader = (props: LiveProps) => {
    const { account, contracts } = props
    const [balance, setBalance] = useState<string>("0.0")
    const [lockedBalance, setLockedBalance] = useState<string>();
    const blockNumber = useBlockNumber();
    const { flxLaunchDaiPrice } = useBlockchainContext()
    const [formattedFLXPrice, setFormattedFLXPrice] = useState<string>();

    useEffect(() => {
        const dollarValue = ethers.utils.formatEther(flxLaunchDaiPrice);
        setFormattedFLXPrice(parseFloat(dollarValue).toFixed(2))
    }, [flxLaunchDaiPrice])

    useEffect(() => {
        const fetchBalance = async () => {
            if (account) {
                try {
                    const balanceValue = await contracts.coupon.balanceOf(account);
                    const formattedBalance = ethers.utils.formatEther(balanceValue);
                    const balanceFixed = parseFloat(formattedBalance).toFixed(4); // Ensure it always has 4 decimal places
                    setBalance(balanceFixed);
                } catch (error) {
                    console.error('Failed to fetch balance:', error);
                }
            }
        };

        fetchBalance();

        const fetchLockupBalance = async () => {
            if (account) {
                const balance = await contracts.tokenLockup.lockedBalances(account, contracts.coupon.address)

                const formattedBalance = ethers.utils.formatEther(balance)
                const balanceFixed = parseFloat(formattedBalance).toFixed(4); // Ensure it always has 4 decimal places
                setLockedBalance(balanceFixed);
            }
        }
        fetchLockupBalance()
    }, [account, blockNumber]); // Re-run when account or block number changes

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
            <Grid item>
                <Typography variant="h5" style={{ color: '#00A36C' }}>
                    ${formattedFLXPrice} <i>minimum launch price</i>
                </Typography>

            </Grid>
        </Grid>
    );
};

export default BalanceHeader;
