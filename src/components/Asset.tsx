import { Container, Grid, Link, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Contracts, useBlockchainContext } from '../contexts/BlockchainContextProvider';

import burn from "../images/burn.png"
import lock from "../images/padlock.png"
import { getImagePath } from '../extensions/ImageMapper';
import { useBlockNumber } from '@usedapp/core';
import { BigNumber, ethers } from 'ethers';
import behodler from "../images/behodler.png"
import uniswap from "../images/uniswap.png"
import shibaswap from "../images/shibaswap.png"
import { AMM, AssetProps } from '../types/Assets';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';
import { TeraToString } from '../extensions/Utils';
import _ from 'lodash';
import ethTilt from "../images/ethPriceTilting.png"
import uniTilt from '../images/uniPriceTilt.png'
import shibTilt from '../images/shibPriceTilt.png'
import treasure from '../images/eye-treasure.png'

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
        flxDollarPrice, setSelectedAssetId, inputDollarPrices, rewardConfig, customRewardBalance
    } = useBlockchainContext()
    const [currentBalance, setCurrentBalance] = useState<string | undefined>(undefined)
    const inputs = contracts.inputs
    const selectedInput = inputs.filter(input => input.address.toLowerCase() === asset.address.toLowerCase())[0]
    const selectedDynamic = (selectedInput !== undefined && dynamicTokenInfo) ? dynamicTokenInfo[selectedInput.address] : undefined
    const [dollarValueOfFlaxReward_str, setDollarValueOfFlaxReward_str] = useState<string>()
    const [inputDollarPrice, setInputDollarPrice] = useState<string | undefined>()
    const [showTreasure, setShowTreasure] = useState<boolean>(false)

    useDeepCompareEffect(() => {
        if (selectedDynamic && rewardConfig && rewardConfig.token) {
            setShowTreasure(rewardConfig.token.address !== ethers.constants.AddressZero
                && rewardConfig.rewardSize.gt(0)
                && customRewardBalance.gte(rewardConfig.rewardSize)
                && selectedDynamic.rewardEnabled)
        }

    }, [customRewardBalance, rewardConfig, selectedDynamic])

    useDeepCompareEffect(() => {
        if (inputDollarPrice && dollarValueOfFlaxReward_str) {
            const inputDollarFloat = parseFloat(inputDollarPrice)
            const dollarValueOfFlaxReward = parseFloat(dollarValueOfFlaxReward_str)

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
    }, [inputDollarPrice, dollarValueOfFlaxReward_str, dynamicTokenInfo, blockNumber])

    useDeepCompareEffect(() => {
        const daiPrice = inputDollarPrices[props.children.address.toLowerCase()]
        if (daiPrice) {
            const float = parseFloat(ethers.utils.formatEther(daiPrice))
            const decimalPlaces = float > 0.01 ? 2 : 12
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
            setDollarValueOfFlaxReward_str(parseFloat(ethers.utils.formatEther(flxValueBig)).toFixed(12));
        }
    }, [flxDollarPrice, dynamicTokenInfo])

    useDeepCompareEffect(() => {
        if (selectedInput && dynamicTokenInfo && dynamicTokenInfo[selectedInput.address] && dynamicTokenInfo[selectedInput.address].balance) {
            const formattedBalance = ethers.utils.formatEther(dynamicTokenInfo[selectedInput.address].balance);
            const balanceFixed = parseFloat(formattedBalance).toFixed(12); // Ensure it always has 8 decimal places
            setCurrentBalance(balanceFixed);
        }
    }, [dynamicTokenInfo])

    const image = <img src={imagePath.default || imagePath} style={{ height: '40px', borderRadius: "25px" }} />
    const treasureIcon = showTreasure ? <Tooltip title={`${parseInt(ethers.utils.formatEther(rewardConfig.rewardSize))} EYE reward for minting more than ${parseInt(ethers.utils.formatEther(rewardConfig.minFlax))} FLX`}><img src={treasure} style={{ width: "20px", margin: "0 0 0 -15px" }} /></Tooltip> : <></>
    const ammLinks = asset.AMMs?.map((amm, index) => getAMMLink(amm, index))
    const [burnableImage, setBurnableImage] = useState<React.ReactElement>(<></>)

    const [mintPrice, setMintPrice] = useState<string>("")
    const [burnMessage, setBurnMessage] = useState<string>("")
    const [mintMessage, setMintMessage] = useState<string>(`1 ${asset.friendlyName} mints ${mintPrice} Flax (\$${dollarValueOfFlaxReward_str})`)
    useEffect(() => {
        if (selectedDynamic) {
            setBurnMessage(`Deposit ${selectedDynamic.burnable ? "burnt" : "permanently locked"} on Flax minting`)
            let places = 4
            setMintPrice(TeraToString(selectedDynamic.teraCouponPerToken, places))
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
            setMintMessage(`1 ${asset.friendlyName} mints ${mintPrice} Flax (\$${dollarValueOfFlaxReward_str})`)
        }
    }, [selectedDynamic])

    const APYtext = (!props.APY || props.APY === 0) ? '--.- ' : props.APY.toFixed(2);


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
                    {image} {treasureIcon}
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
                                    <Typography style={{ textAlign: "right" }} variant={"h6"}> (${dollarValueOfFlaxReward_str})</Typography>
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