import React, { useEffect, useState } from 'react';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { Box, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { getImagePath } from '../extensions/ImageMapper';
import assetJSON from "../constants/AssetLists.json"
import { AssetProps, Assets } from '../types/Assets';
import { ERC20 } from "../typechain/types/ethers";
import { BigNumber, ethers } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import TransactionButton from './TransactionButton';
import { TransactionProgress } from '../extensions/Broadcast';
import IconTextBox, { invalidReasons } from './IconTextBox';
import { LiveProps } from '../extensions/LiveProps';
import { isEthAddress } from '../extensions/Utils';
import { useProvider } from '../hooks/useProvider';
import { ChainID } from '../types/ChainID';
import { getDaiPriceOfToken } from '../extensions/Uniswap';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';

const validateMintText = (text: string) => {
    const floatRegex = /^\d+(\.\d+)?$/;
    return floatRegex.test(text) && !isNaN(parseFloat(text));
}

export default function MintPanel(props: LiveProps) {
    const [flaxAllowance, setFlaxAllowance] = useState<BigNumber>()
    const [lockDuration, setLockDuration] = useState<number>()
    const [inputBalance, setInputBalance] = useState<BigNumber>();
    const { contracts, account, chainId } = props
    const { selectedAssetId, dynamicTokenInfo, flxDollarPrice, daiPriceOfEth } = useBlockchainContext()
    const blockNumber = useBlockNumber()
    const [asset, setAsset] = useState<AssetProps>()
    const [token, setToken] = useState<ERC20>()
    const [updateChecker, setUpdateChecker] = useState<number>(0)
    const [assetApproved, setAssetApproved] = useState<boolean>(false)
    const [imagePath, setImagePath] = useState<any>()
    const [approveProgress, setApproveProgress] = useState<TransactionProgress>(TransactionProgress.dormant)
    const [mintProgress, setMintProgress] = useState<TransactionProgress>(TransactionProgress.dormant)
    const [mintText, setMintText] = useState<string>("")
    const [invalidReason, setInvalidReason] = useState<invalidReasons>("")

    const [flaxToMint, setFlaxToMint] = useState<string>("")
    const [mintDai, setMintDai] = useState<string>()
    const dynamic = token ? dynamicTokenInfo[token.address] : undefined
    const [inputDollarPrice, setInputDollarPrice] = useState<BigNumber | undefined>()
    const [dollarValueOfInputText, setDollarValueOfInputText] = useState<string | undefined>()

    const ethProvider = useProvider()

    useEffect(() => {
        if (ethProvider && chainId === ChainID.mainnet && asset) {
            const fetchDaiPrice = async () => {
                if (daiPriceOfEth) {
                    const daiPrice = await getDaiPriceOfToken(asset.address, ethProvider, chainId, daiPriceOfEth)
                    setInputDollarPrice(daiPrice)

                } else {
                    setInputDollarPrice(undefined)
                }
            }
            fetchDaiPrice();
        }

    }, [blockNumber, chainId, ethProvider, selectedAssetId])

    useEffect(() => {
        if (contracts && contracts.issuer) {
            try {
                contracts.issuer.mintAllowance().then(setFlaxAllowance).catch()
                contracts.issuer.lockupDuration().then(duration => setLockDuration(duration.toNumber())).catch()
            } catch { }
        }
    }, [contracts])

    useEffect(() => {
        if (mintProgress === TransactionProgress.confirmed) {
            setMintText("")
            setFlaxToMint("")
        }
    }, [mintProgress])

    useEffect(() => {
        if (isEthAddress(selectedAssetId) && isEthAddress(account)) {
            const selectedInput = contracts.inputs.find(input => input.address === selectedAssetId)
            if (selectedInput) {
                const getBalance = async () => {
                    setInputBalance(await selectedInput.balanceOf(account).catch())
                }
                try {
                    getBalance()
                } catch { }
            }
        }
    }, [selectedAssetId, account])

    useDeepCompareEffect(() => {
        if (dynamic) {
            if (validateMintText(mintText)) {
                const mintWei = ethers.utils.parseUnits(mintText, 18)
                const big = mintWei.mul(dynamic.teraCouponPerToken)
                const divTera = big.div(1000_000_000_000)
                const flax = ethers.utils.formatEther(divTera.toString()).toString()
                if (flax != flaxToMint) {
                    setFlaxToMint(flax);
                    const daiValueWei = flxDollarPrice.mul(divTera).div(BigNumber.from(10).pow(18));
                    setMintDai(parseFloat(ethers.utils.formatEther(daiValueWei)).toFixed(2));
                    validateInput(mintWei, divTera);
                    if (inputDollarPrice) {
                        const dollarWei = mintWei.mul(inputDollarPrice).div(ethers.constants.WeiPerEther)
                        const formatted = parseFloat(ethers.utils.formatEther(dollarWei)).toFixed(2)
                        setDollarValueOfInputText(formatted)
                    }
                    else {
                        setDollarValueOfInputText(undefined)
                    }
                }
            } else {
                setInvalidReason("Invalid Input")
            }
        }
    }, [mintText, invalidReason, blockNumber, inputBalance, dynamic])

    const validateInput = (mintWei: BigNumber, flaxToMint: BigNumber) => {
        if (flaxAllowance && mintWei.gt(flaxAllowance)) {
            setInvalidReason("Exceeds Flax Mint Allowance")
        } else if (inputBalance && mintWei.gt(inputBalance)) {
            setInvalidReason("Exceeds Balance")
        }
        else setInvalidReason("")
    }

    useEffect(() => {
        if (chainId && selectedAssetId.length > 2) {
            const currentAssets = (assetJSON as Assets)[chainId]
            const selectedAsset = currentAssets.filter(asset => asset.address === selectedAssetId)[0]
            setAsset(selectedAsset)
            setMintText("")
        }
    }, [selectedAssetId, chainId])

    useEffect(() => {
        setUpdateChecker(updateChecker + 1)
    }, [approveProgress])

    useEffect(() => {
        if (asset) {
            const path = require(`../images/${getImagePath(asset.image)}`)
            setImagePath(path)

            setToken(contracts.inputs.filter(c => c.address === asset.address)[0])
        }
    }, [asset])

    useEffect(() => {
        if (token && validateMintText(mintText)) {
            const getApproval = async () => {
                const allowance = await token.allowance(account, contracts.issuer.address)
                const mintWei = ethers.utils.parseUnits(mintText, 18)
                setAssetApproved(allowance.gte(mintWei))
            }
            getApproval()
        }
    }, [token, updateChecker, mintText])

    const cornerImage = !assetApproved && imagePath !== undefined ? <img src={imagePath || imagePath} style={{ height: `20px` }} /> : <div></div>
    const iconImage = <img src={imagePath} style={{ height: `40px`,borderRadius:"25px" }} />

    const iconTextBox = <IconTextBox dollarValueOfInput={dollarValueOfInputText} text={mintText} setText={setMintText} cornerImage={iconImage} max={dynamic !== undefined ? ethers.utils.formatEther(dynamic.balance) : "0"} invalidReason={invalidReason} />;

    return (
        <Paper style={{ height: '300px', padding: '20px', backgroundColor: '#1D2833' }}>
            <Grid
                container
                direction="column"
                justifyContent="stretch"  // Ensures vertical stretching
                alignItems="center"
                spacing={2}
            >
                <Grid item style={{ width: '100%' }}>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ width: '100%' }}  // Ensures this Grid container takes full width
                    >
                        <Grid item>
                            <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                Mint Flax with {asset?.friendlyName}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {cornerImage}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item style={{ width: '100%', paddingTop: "60px" }}>
                    <div></div>
                </Grid>
                <Grid item>
                    <div>{iconTextBox}</div>
                </Grid>
                {token && (
                    <>
                        <Grid item>
                            {assetApproved ?
                                <Grid container
                                    direction="column"
                                    alignItems="center">
                                    <Grid item>
                                        <TransactionButton progressSetter={setMintProgress} progress={mintProgress} invalid={invalidReason.length > 0} transactionGetter={() => contracts.issuer.issue(token.address, ethers.utils.parseEther(mintText).toString())} >
                                            Mint {flaxToMint !== "" ? parseFloat(flaxToMint).toFixed(2) : ""} Flax {mintDai && mintDai !== "" ? '($' + mintDai + ')' : ''}
                                        </TransactionButton>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            (streamed over {lockDuration} days)
                                        </Typography>
                                    </Grid>
                                </Grid>
                                :
                                <TransactionButton progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() => token.approve(contracts.issuer.address, ethers.constants.MaxUint256)} >
                                    Approve {asset?.friendlyName} for minting Flax
                                </TransactionButton>
                            }
                        </Grid>

                        {flaxAllowance ?
                            <Grid item style={{ width: "100%" }}>
                                <Grid container direction="row" justifyContent="center">
                                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                                        <Tooltip title="This is the maximum amount of Flax that can be minted in one transaction.">
                                            <Typography variant='h6' sx={{ fontWeight: "bold", fontSize: (theme) => theme.typography.h5.fontSize }}>Max Flax per mint: {ethers.utils.formatEther(flaxAllowance)}</Typography>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid> : <></>}

                    </>)}
            </Grid>
        </Paper>

    );
}
