import { Container, Grid, Link, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Contracts, useBlockchainContext } from '../contexts/BlockchainContextProvider';

import burn from "../images/burn.png"
import lock from "../images/padlock.png"
import { acceptableImages, getImagePath } from '../extensions/ImageMapper';
import { useBlockNumber, useTokenBalance } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import behodler from "../images/behodler.png"
import uniswap from "../images/uniswap.png"
import shibaswap from "../images/shibaswap.png"
import { AMM, AssetProps } from '../types/Assets';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';
import { TeraToString } from '../extensions/Utils';
import _ from 'lodash';
import { useProvider } from '../hooks/useProvider';
import { ChainID } from '../types/ChainID';
import TilterRatio from './common/TilterRatio';
import ethTilt from "../images/ethPriceTilting.png"
import uniTilt from '../images/uniPriceTilt.png'
import shibTilt from '../images/shibPriceTilt.png'
enum swapperType {
    behoder,
    uni,
    shib
}
const baseAMMURL = (amm: AMM): { swapper: swapperType, url: string } => {
    let swapper: swapperType = swapperType.behoder
    let url: string = ""
    if (amm.location === 'shiba') {
        url = 'https://shibaswap.com/'
        swapper = swapperType.shib
    }
    else if (amm.location === 'uni') {
        url = 'https://app.uniswap.org/'
        swapper = swapperType.uni
    }
    else {
        url = 'https://app.behodler.io/pyro'
        swapper = swapperType.behoder
    }
    url += amm.url
    return { swapper, url }
}


const getAMMLink = (amm: AMM, muiKey: number) => {
    const { swapper, url } = baseAMMURL(amm)
    const buyPhrase = amm.type === "LP" || amm.type === "pyro" ? "Mint on " : "Buy from ";
    const title = buyPhrase + (swapper === swapperType.uni ? "Uniswap" : (swapper === swapperType.behoder ? "Behodler" : "Shibaswap"))
    return <Tooltip key={muiKey} title={title}><img width="30px" src={swapper === swapperType.uni ? uniswap : (swapper === swapperType.behoder ? behodler : shibaswap)} style={{ margin: "0 5px 0 0" }} onClick={() => window.open(url, "_blank")} />
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
        account, flxDollarPrice, chainId, daiPriceOfEth, setSelectedAssetId, selectedAssetId, inputDollarPrices,
    } = useBlockchainContext()
    const [currentBalance, setCurrentBalance] = useState<string | undefined>(undefined)
    const inputs = contracts.inputs
    const selectedInput = inputs.filter(input => input.address.toLowerCase() === asset.address.toLowerCase())[0]
    const selectedDynamic = (selectedInput !== undefined && dynamicTokenInfo) ? dynamicTokenInfo[selectedInput.address] : undefined
    const [flxValueOfReward, setFlxValueOfReward] = useState<string>()
    const [inputDollarPrice, setInputDollarPrice] = useState<string | undefined>()
    const ethProvider = useProvider();

    useDeepCompareEffect(() => {
        if (inputDollarPrice && flxValueOfReward) {
            const inputDollarFloat = parseFloat(inputDollarPrice)
            const dollarValueOfFlaxReward = parseFloat(flxValueOfReward)

            if (isNaN(inputDollarFloat) || isNaN(dollarValueOfFlaxReward)) {
                props.setAPY(0)
            } else {
                const premium = dollarValueOfFlaxReward - inputDollarFloat
                const ROI = premium / inputDollarFloat
                const APY_Float = ((1 + ROI * ROI) - 1) * (ROI < 0 ? -100 : 100)
                props.setAPY(APY_Float)
            }
        } else {
            props.setAPY(0)
        }
    }, [inputDollarPrice, flxValueOfReward, dynamicTokenInfo, blockNumber])

    useDeepCompareEffect(() => {
        const daiPrice = inputDollarPrices[props.children.address.toLowerCase()]
        if (daiPrice) {
            const float = parseFloat(ethers.utils.formatEther(daiPrice))
            const decimalPlaces = float > 0.01 ? 2 : 6
            const formatted = parseFloat(ethers.utils.formatEther(daiPrice)).toFixed(decimalPlaces)
            setInputDollarPrice(formatted)
        }
        else {
            setInputDollarPrice(undefined)
        }

    }, [inputDollarPrices])

    useDeepCompareEffect(() => {
        if (dynamicTokenInfo && dynamicTokenInfo[props.children.address.toLowerCase()]) {
            const teraCouponPerToken = dynamicTokenInfo[props.children.address.toLowerCase()].teraCouponPerToken
            const factor = BigNumber.from(10).pow(12);
            const flxValueBig = teraCouponPerToken.mul(flxDollarPrice).div(factor)
            setFlxValueOfReward(parseFloat(ethers.utils.formatEther(flxValueBig)).toFixed(6));
        }
    }, [flxDollarPrice, dynamicTokenInfo])

    useDeepCompareEffect(() => {
        if (selectedInput && dynamicTokenInfo && dynamicTokenInfo[selectedInput.address] && dynamicTokenInfo[selectedInput.address].balance) {
            const formattedBalance = ethers.utils.formatEther(dynamicTokenInfo[selectedInput.address].balance);
            const balanceFixed = parseFloat(formattedBalance).toFixed(8); // Ensure it always has 8 decimal places
            setCurrentBalance(balanceFixed);
        }
    }, [dynamicTokenInfo])

    const image = <img src={imagePath.default || imagePath} style={{ height: '40px', borderRadius: "25px" }} />
    const ammLinks = asset.AMMs?.map((amm, index) => getAMMLink(amm, index))
    const [burnableImage, setBurnableImage] = useState<React.ReactElement>(<></>)

    const [mintPrice, setMintPrice] = useState<string>("")
    const [burnMessage, setBurnMessage] = useState<string>("")
    const [mintMessage, setMintMessage] = useState<string>(`1 ${asset.friendlyName} mints ${mintPrice} Flax (\$${flxValueOfReward})`)
    useEffect(() => {
        if (selectedDynamic) {
            setBurnMessage(`Deposit ${selectedDynamic.burnable ? "burnt" : "permanently locked"} on Flax minting`)
            setMintPrice(TeraToString(selectedDynamic.teraCouponPerToken))
            let burnSource = selectedDynamic.burnable ? burn : lock
            const tilting = selectedDynamic.issuerToApprove !== contracts.issuer.address
            if (tilting) {
                burnSource = (() => {
                    switch (asset.friendlyName) {
                        case 'Shib':
                            return shibTilt
                        case 'Uni':
                            return uniTilt
                        default:
                            return ethTilt
                    }
                })()
                setBurnMessage(`Deposit of ${asset.friendlyName} boosts both Flax price and liquidity instantly.`)
            }
            setBurnableImage(<Tooltip title={burnMessage}>
                <img width="30px" src={burnSource} style={{ margin: "5px 0 0 0" }} />
            </Tooltip>)
            setMintMessage(`1 ${asset.friendlyName} mints ${mintPrice} Flax (\$${flxValueOfReward})`)
        }
    }, [selectedDynamic])

    const APYtext = props.APY === 0 ? '--.- ' : props.APY.toFixed(2);

    //carry on here
    return <ListItem
        key={asset.address}
        disablePadding
        style={{ height: '80px' }}  // Set fixed height for each row
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#273340'}  // Highlight on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <ListItemButton onClick={() => setSelectedAssetId(asset.address)} style={{ width: '100%', height: '100%' }}>
            <Grid container wrap="nowrap" alignItems="flex-start" spacing={1} >
                <Grid item>
                    {image}
                </Grid>
                <Grid item xs  >
                    <Grid container direction="column" >
                        <Grid item>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={1}
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
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" style={{ cursor: 'pointer' }}>
                                Wallet balance: {currentBalance === undefined ? <i>fetching...</i> : <>{currentBalance}</>}
                            </Typography>
                        </Grid>
                    </Grid>




                </Grid>
                <Grid item >
                    <Grid
                        container
                        direction="row"
                        justifyContent="left"
                        alignItems="space-between"
                        sx={{ width: "500px" }}
                    >
                        <Grid item style={{ width: "150px" }}>
                            {ammLinks}
                        </Grid>
                        <Grid item style={{ width: "150px" }} >
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item >


                                    {burnableImage}
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item style={{ width: "120px" }}>

                            <Tooltip title={mintMessage}>
                                <div>
                                    <Typography style={{ textAlign: "right" }} variant={"h3"}> {mintPrice} FLX</Typography>
                                    <Typography style={{ textAlign: "right" }} variant={"h6"}> (${flxValueOfReward})</Typography>
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid item style={{ width: "70px" }}>

                            {props.APY > 0 ? <Typography style={{ textAlign: "right", color: "forestgreen" }} variant={"h3"}>{APYtext}%</Typography> :
                                <Typography style={{ textAlign: "right", color: "red" }} variant={"h3"}>{APYtext}%</Typography>}

                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        </ListItemButton>
    </ListItem>
}