import { Grid, Link, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DynamicTokenInfo, useBlockchainContext } from '../contexts/BlockchainContextProvider';

import burn from "../images/burn.png"
import lock from "../images/padlock.png"
import { acceptableImages, getImagePath } from '../extensions/ImageMapper';
import { useBlockNumber, useTokenBalance } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import behodler from "../images/behodler.png"
import uniswap from "../images/uniswap.png"
import { AMM, AssetProps } from '../types/Assets';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';
import { TeraToString } from '../extensions/Utils';



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
    const blockNumber = useBlockNumber();
    const { contracts, dynamicTokenInfo, updateDyamicTokenInfo: updateBalance } = useBlockchainContext()
    const [currentBalance, setCurrentBalance] = useState<string | undefined>(undefined)
    const inputs = contracts.inputs
    const selectedInput = inputs.filter(input => input.address === asset.address)[0]

    const selectedDynamic = selectedInput !== undefined ? dynamicTokenInfo[selectedInput.address] : undefined

    useDeepCompareEffect(() => {
        const fetchBalance = async () => {
            if (account && selectedInput && inputs.length > 0) {
                try {
                    const balance = await selectedInput.balanceOf(account);
                    const { burnable, teraCouponPerToken } = await contracts.issuer.whitelist(selectedInput.address)
                    updateBalance(selectedInput.address, { balance, burnable, teraCouponPerToken })
                } catch (error) {
                    console.error('Failed to fetch balance:', error);
                }
            }
        };

        fetchBalance();
    }, [account, blockNumber, dynamicTokenInfo]); // NOTE:if list grows long and rendering gets too heavy, remove balanceMap dependency

    useDeepCompareEffect(() => {
        if (selectedInput && selectedDynamic) {
            const formattedBalance = ethers.utils.formatEther(dynamicTokenInfo[selectedInput.address].balance);
            const balanceFixed = parseFloat(formattedBalance).toFixed(4); // Ensure it always has 4 decimal places
            setCurrentBalance(balanceFixed);
        }
    }, [dynamicTokenInfo])


    const image = <img src={imagePath.default || imagePath} style={{ height: '40px' }} />
    const ammLinks = asset.AMMs?.map((amm, index) => getAMMLink(amm, index))
    let burnableImage = <></>
    let mintPrice = ""
    if (selectedDynamic !== undefined) {
        const burnMessage = `Deposit ${selectedDynamic.burnable ? "burnt" : "permanently locked"} on Flax minting`
        const burnSource = selectedDynamic.burnable ? burn : lock
        burnableImage = <Tooltip title={burnMessage}><img width="30px" src={burnSource} style={{ margin: "5px 0 0 0" }} />
        </Tooltip>
        mintPrice = TeraToString(selectedDynamic.teraCouponPerToken)
    }
    const mintMessage = `1 ${asset.friendlyName} mints ${mintPrice} Flax`
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
                        SCX. Wallet balance: {currentBalance === undefined ? <i>fetching...</i> : <>{currentBalance}</>}
                    </Typography>

                </Grid>
                <Grid item xs >
                    <Grid
                        container
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                    >
                        <Grid item style={{ width: "110px" }}>
                            {ammLinks}
                        </Grid>
                        <Grid item style={{ width: "30px" }} >
                            {burnableImage}
                        </Grid>
                        <Grid item style={{ width: "100px" }}>
                            <Tooltip title={mintMessage}>
                                <Typography style={{ marginTop: "5px", textAlign: "right" }} variant="h3"> {mintPrice} FLX</Typography>
                            </Tooltip>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </ListItemButton>
    </ListItem>
}