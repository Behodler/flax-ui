import React, { useEffect, useState } from 'react';
import { Box, Grid, List, ListItem, Tooltip, Typography } from '@mui/material';
import Flax from "../images/FlaxSmall.png"
import HedgeyIcon from "../images/hedgeyIcon.png"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useEthers, useBlockNumber } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import { LiveProps } from '../extensions/LiveProps';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const AdminListItem = (props: { children: string }) => {
    return <ListItem >
        <Typography variant="h5" style={{ color: 'green' }}>
            {props.children}
        </Typography>
    </ListItem>
}

const BalanceHeader = (props: LiveProps) => {
    const { account, contracts } = props
    const [balance, setBalance] = useState<string>("0.0")
    const [lockedBalance, setLockedBalance] = useState<string>();
    const blockNumber = useBlockNumber();
    const { tilterBalanceMapping, flxDollarPrice, customRewardBalance, couponBalanceOfIssuer, accountIsOwner } = useBlockchainContext()
    const [formattedFlaxPrice, setFormattedFlaxPrice] = useState<string>("-.--")

    useEffect(() => {
        setFormattedFlaxPrice(parseFloat(ethers.utils.formatEther(flxDollarPrice)).toFixed(2))
    }, [flxDollarPrice])

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
            {accountIsOwner ? <Grid item>
                <List>
                    <AdminListItem key="issuer">
                        {`Issuer Flax balance: ${ethers.utils.formatEther(couponBalanceOfIssuer)}`}
                    </AdminListItem>
                    <AdminListItem key="reward">
                        {`Reward balance: ${ethers.utils.formatEther(customRewardBalance)}`}
                    </AdminListItem>
                    <AdminListItem key="heading">
                        Tilter flax balances
                    </AdminListItem>
                    {Object.keys(tilterBalanceMapping).map(tilter => (
                        <AdminListItem key={tilter}>
                            {`${tilter}: ${ethers.utils.formatEther(tilterBalanceMapping[tilter])}`}
                        </AdminListItem>
                    ))}

                </List>
            </Grid> : <></>}

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
                <Tooltip title="This is the current Uniswap V2 price">
                    <Typography variant="h5" style={{ color: '#00A36C' }}>
                        ${formattedFlaxPrice}
                    </Typography>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

export default BalanceHeader;
