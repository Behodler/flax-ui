import React, { useEffect, useState } from 'react';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import Flax from "../images/FlaxSmall.png"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useEthers, useBlockNumber } from '@usedapp/core';
import { ethers } from 'ethers';

const BalanceHeader = () => {
    const [balance, setBalance] = useState<string>("0.0000")
    const { contracts, account } = useBlockchainContext()
    const blockNumber = useBlockNumber();

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
                <Tooltip title="Flax (FLX)" placement="left">
                    <Box component="img" src={Flax} alt="Balance Icon" sx={{ height: '40px', width: '40px', marginRight: '10px', cursor: 'pointer' }} />
                </Tooltip>
                <Typography variant="h2">
                    {balance}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h5" style={{ color: '#00A36C' }}>
                    $0.00
                </Typography>
            </Grid>
        </Grid>
    );
};

export default BalanceHeader;
