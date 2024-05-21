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

const validateMintText = (text: string) => {
    const floatRegex = /^\d+(\.\d+)?$/;
    return floatRegex.test(text) && !isNaN(parseFloat(text));
}

export default function MintPanel(props: LiveProps) {
    const [flaxAllowance, setFlaxAllowance] = useState<BigNumber>(BigNumber.from(0))
    const { contracts, account, chainId } = props
    const { selectedAssetId, dynamicTokenInfo } = useBlockchainContext()
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
    const dynamic = token ? dynamicTokenInfo[token.address] : undefined

    useEffect(() => {
        contracts.issuer.mintAllowance().then(setFlaxAllowance)
    }, [blockNumber, chainId])

    useEffect(() => {
        if (mintProgress === TransactionProgress.confirmed) {
            setMintText("")
            setFlaxToMint("")
        }
    }, [mintProgress])


    useEffect(() => {
        if (invalidReason !== "Invalid Input" && dynamic && validateMintText(mintText)) {
            const mintWei = ethers.utils.parseUnits(mintText, 18)
            const big = mintWei.mul(dynamic.teraCouponPerToken)
            const divTera = big.div(1000_000_000_000)
            const flax = ethers.utils.formatEther(divTera.toString()).toString()
            if (flax != flaxToMint) {
                setFlaxToMint(flax);
                setInvalidReason(validateFlaxMintAllowance(flax, flaxAllowance, invalidReason))
            }
        }
    }, [mintText, invalidReason])

    //validate mint allowance
    const validateFlaxMintAllowance = (flax: string, allowance: BigNumber, existingReason: invalidReasons): invalidReasons => {
        if (invalidReason == "" && !isNaN(parseFloat(flax))) {
            const flaxToMintWei = ethers.utils.parseEther(flax)
            if (flaxToMintWei.gt(allowance)) {
                return "Exceeds Flax Mint Allowance"
            }
            else return ""
        }
        return existingReason
    }

    useEffect(() => {
        setInvalidReason(validateFlaxMintAllowance(flaxToMint, flaxAllowance, invalidReason))
    }, [flaxToMint, flaxAllowance])

    useEffect(() => {
        const floatRegex = /^\d+(\.\d+)?$/;
        const validInput = floatRegex.test(mintText) && !isNaN(parseFloat(mintText));
        let reason: invalidReasons = ""
        if (!validInput) {
            reason = "Invalid Input"
            setFlaxToMint("")
        } else if (token) {
            const mintWei = ethers.utils.parseUnits(mintText, 18)

            if (mintWei.gt(dynamicTokenInfo[token.address].balance)) {
                reason = "Exceeds Balance"
            } else {
                reason = validateFlaxMintAllowance(flaxToMint, flaxAllowance, reason)
            }

        }

        setInvalidReason(reason)
    }, [mintText, flaxAllowance])

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
    const iconImage = <img src={imagePath} style={{ height: `40px` }} />

    const iconTextBox = <IconTextBox text={mintText} setText={setMintText} cornerImage={iconImage} max={dynamic !== undefined ? ethers.utils.formatEther(dynamic.balance) : "0"} invalidReason={invalidReason} />;

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
                                <TransactionButton progressSetter={setMintProgress} progress={mintProgress} invalid={invalidReason.length > 0} transactionGetter={() => contracts.issuer.issue(token.address, ethers.utils.parseEther(mintText).toString())} >
                                    Mint {flaxToMint !== "" ? flaxToMint : ""} Flax
                                </TransactionButton>
                                :
                                <TransactionButton progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() => token.approve(contracts.issuer.address, ethers.constants.MaxUint256)} >
                                    Approve {asset?.friendlyName} for minting Flax
                                </TransactionButton>
                            }
                        </Grid>

                        <Grid item style={{ width: "100%" }}>
                            <Grid container direction="row" justifyContent="center">
                                <Grid item xs={12} style={{ textAlign: 'right' }}>
                                    <Tooltip title="This is the remaining amount of Flax that can be minted.
                                     Dapps which add liquidity such as the price tilter from Flan (upcoming) will top up the Flax mint allowance.
                                    This restriction prevents hyperinflation">
                                        <Typography variant='h6' sx={{ fontWeight: "bold", fontSize: (theme) => theme.typography.h5.fontSize }}>Flax mint allowance remaining: {ethers.utils.formatEther(flaxAllowance)}</Typography>
                                    </Tooltip>
                                </Grid>
                            </Grid>

                        </Grid>
                    </>)}
            </Grid>
        </Paper>

    );
}
