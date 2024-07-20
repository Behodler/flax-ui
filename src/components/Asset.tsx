import { Grid, Link, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Contracts, useBlockchainContext } from '../contexts/BlockchainContextProvider';

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
import _ from 'lodash';
import { getDaiPriceOfToken } from '../extensions/Uniswap';
import { useProvider } from '../hooks/useProvider';
import { ChainID } from '../types/ChainID';



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
interface IProps {
    contracts: Contracts
    children: AssetProps
    APY: number,
    setAPY: (apy: number) => void
}
export function Asset(props: IProps) {
    const { contracts } = props
    const { children: asset } = props
    const imagePath = require(`../images/${getImagePath(asset.image)}`);
    const blockNumber = useBlockNumber();
    const { dynamicTokenInfo,
        account, flxDollarPrice, chainId, daiPriceOfEth ,setSelectedAssetId, selectedAssetId 
     } = useBlockchainContext()
    const [currentBalance, setCurrentBalance] = useState<string | undefined>(undefined)
    const inputs = contracts.inputs
    const selectedInput = inputs.filter(input => input.address === asset.address)[0]
    const selectedDynamic = (selectedInput !== undefined && dynamicTokenInfo)? dynamicTokenInfo[selectedInput.address] : undefined
    const [flxValue, setFlxValue] = useState<string>()
    const [inputDollarPrice, setInputDollarPrice] = useState<string | undefined>()
    const ethProvider = useProvider();

    useEffect(() => {
        if (inputDollarPrice && flxValue) {
            const inputDollarFloat = parseFloat(inputDollarPrice)
            const flxDollar = parseFloat(flxValue)
            if (isNaN(inputDollarFloat) || isNaN(flxDollar)) {
                props.setAPY(0)
            } else {
                const premium = flxDollar - inputDollarFloat
                const ROI = premium / inputDollarFloat
                const APY_Float = ((1 + ROI * ROI) - 1) * (ROI < 0 ? -100 : 100)
                props.setAPY(APY_Float)
            }
        } else {
            props.setAPY(0)
        }
    }, [inputDollarPrice, flxValue])

    useEffect(() => {
        if (ethProvider && chainId === ChainID.mainnet) {
            const fetchDaiPrice = async () => {
                if (daiPriceOfEth) {

                    const daiPrice = await getDaiPriceOfToken(props.children.address, ethProvider, chainId, daiPriceOfEth)
                    if (daiPrice) {
                        const formatted = parseFloat(ethers.utils.formatEther(daiPrice)).toFixed(2)
                        setInputDollarPrice(formatted)
                    }
                } else {
                    setInputDollarPrice(undefined)
                }
            }
            if (blockNumber && (blockNumber % 3 == 0 || inputDollarPrice !== undefined))
                fetchDaiPrice();
        }

    }, [blockNumber, chainId, ethProvider, selectedAssetId])

    useDeepCompareEffect(() => {
        if (dynamicTokenInfo && dynamicTokenInfo[props.children.address]) {
            const teraCouponPerToken = dynamicTokenInfo[props.children.address].teraCouponPerToken
            const factor = BigNumber.from(10).pow(12);
            const flxValueBig = teraCouponPerToken.mul(flxDollarPrice).div(factor)
            setFlxValue(parseFloat(ethers.utils.formatEther(flxValueBig)).toFixed(4));
        }
    }, [flxDollarPrice, dynamicTokenInfo])

    useDeepCompareEffect(() => {
        if (selectedInput && dynamicTokenInfo) {
            const formattedBalance = ethers.utils.formatEther(dynamicTokenInfo[selectedInput.address].balance);
            const balanceFixed = parseFloat(formattedBalance).toFixed(8); // Ensure it always has 8 decimal places
            setCurrentBalance(balanceFixed);
        }
    }, [dynamicTokenInfo])

    const image = <img src={imagePath.default || imagePath} style={{ height: '40px', borderRadius: "25px" }} />
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
    const mintMessage = `1 ${asset.friendlyName} mints ${mintPrice} Flax (\$${flxValue})`
    //carry on here
    return <ListItem
        key={asset.address}
        disablePadding
        style={{ height: '80px' }}  // Set fixed height for each row
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#273340'}  // Highlight on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <ListItemButton onClick={() => setSelectedAssetId(asset.address)} style={{ width: '100%', height: '100%' }}>
            <Grid container wrap="nowrap" alignItems="center" spacing={2} >
                <Grid item>
                    {image}
                </Grid>
                <Grid item xs >

                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                        sx={{ width: "300px" }}
                    >
                        <Grid item>
                            <Typography variant="body1" style={{ cursor: 'pointer' }}>
                                {asset.friendlyName}
                            </Typography>
                        </Grid>
                        {inputDollarPrice ? <Grid item>
                            <Tooltip title={`1 ${asset.friendlyName} = \$${inputDollarPrice}`}>
                                <Typography variant="h6" style={{ cursor: 'pointer' }}>
                                    <b>${inputDollarPrice}</b>
                                </Typography>
                            </Tooltip>
                        </Grid> : <></>}

                    </Grid>

                    <Typography variant="subtitle1" style={{ cursor: 'pointer' }}>
                        Wallet balance: {currentBalance === undefined ? <i>fetching...</i> : <>{currentBalance}</>}
                    </Typography>

                </Grid>
                <Grid item >
                    <Grid
                        container
                        direction="row"
                        justifyContent="left"
                        alignItems="space-between"
                        sx={{ width: "350px" }}
                    >
                        <Grid item style={{ width: "80px" }}>
                            {ammLinks}
                        </Grid>
                        <Grid item style={{ width: "30px" }} >
                            {burnableImage}
                        </Grid>
                        <Grid item style={{ width: "120px" }}>

                            <Tooltip title={mintMessage}>
                                <div>
                                    <Typography style={{ textAlign: "right" }} variant={"h3"}> {mintPrice} FLX</Typography>
                                    <Typography style={{ textAlign: "right" }} variant={"h6"}> (${flxValue})</Typography>
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid item style={{ width: "70px" }}>

                            {props.APY > 0 ? <Typography style={{ textAlign: "right", color: "forestgreen" }} variant={"h3"}>{props.APY.toFixed(2)}%</Typography> :
                                <Typography style={{ textAlign: "right", color: "red" }} variant={"h3"}>{props.APY.toFixed(2)}%</Typography>}

                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        </ListItemButton>
    </ListItem>
}