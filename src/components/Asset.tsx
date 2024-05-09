import { Grid, Link, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';

import eye from "../images/eye.png"
import { acceptableImages, getImagePath } from '../extensions/ImageMapper';
import { useBlockNumber, useTokenBalance } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import behodler from "../images/behodler.png"
import uniswap from "../images/uniswap.png"
import { AMM, AssetProps } from '../types/Assets';



const baseAMMURL = (amm: AMM) => {
    const isUni = amm.type == "LP" || amm.location == "uni"
    let domain = isUni ? "https://app.uniswap.org/" : "https://app.behodler.io/"
    if (!isUni) {
        let page = amm.type === "pyro" ? "pyrotokens" : "swap"
        return { url: domain + page, isUni: false }
    }
    return { url: domain + amm.url, isUni }
}


const getAMMLink = (amm: AMM, muiKey: number) => {
    const { url, isUni } = baseAMMURL(amm)
    const buyPhrase = amm.type === "LP" || amm.type === "pyro" ? "Mint on " : "Buy from ";
    const title = buyPhrase + (isUni ? "Uniswap" : "Behodler")
    return <Tooltip key={muiKey} title={title}><img width="30px" src={isUni ? uniswap : behodler} style={{ margin: "0 5px 0 0" }} onClick={() => window.open(url, "_blank")} />
    </Tooltip>
}

export function Asset(props: { children: AssetProps }) {
    const { setSelectedAssetId } = useBlockchainContext()
    const { children: asset } = props
    const imagePath = require(`../images/${getImagePath(asset.image)}`);
    const { account } = useBlockchainContext()
    const [balance, setBalance] = useState<string>("0.0000")
    const blockNumber = useBlockNumber();
    const { contracts } = useBlockchainContext()
    const inputs = contracts.inputs
    const selectedInput = inputs.filter(input => input.address === asset.address)[0]
    useEffect(() => {
        const fetchBalance = async () => {
            if (account && selectedInput && inputs.length > 0) {
                try {
                    const balanceValue = await selectedInput.balanceOf(account);
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



    const image = <img src={imagePath.default || imagePath} style={{ height: '40px' }} />
    const ammLinks = asset.AMMs?.map((amm, index) => getAMMLink(amm, index))
    //carry on here
    return <ListItem
        key={asset.address}
        disablePadding
        style={{ height: '80px' }}  // Set fixed height for each row
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#273340'}  // Highlight on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <ListItemButton onClick={() => setSelectedAssetId(asset.address)} style={{ width: '100%', height: '100%' }}>
            <Grid container wrap="nowrap" alignItems="center" spacing={2}>
                <Grid item>
                    {image}
                </Grid>
                <Grid item xs>
                    <Typography variant="body1" style={{ cursor: 'pointer' }}>
                        {asset.friendlyName}
                    </Typography>
                    <Typography variant="subtitle1" style={{ cursor: 'pointer' }}>
                        SCX. Wallet balance: {balance}
                    </Typography>

                </Grid>
                <Grid item xs>
                    {ammLinks}
                </Grid>
            </Grid>
        </ListItemButton>
    </ListItem>
}