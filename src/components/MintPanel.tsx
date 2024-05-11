import React, { useEffect, useState } from 'react';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { getImagePath } from '../extensions/ImageMapper';
import assetJSON from "../constants/AssetLists.json"
import { AssetProps, Assets } from '../types/Assets';
import { ERC20 } from '../../types/ethers';
import { BigNumber, ethers } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import TransactionButton from './TransactionButton';
import { IProgressSetter, TransactionProgress } from '../extensions/Broadcast';
import IconTextBox from './IconTextBox';

type invalidReasons = "" | "Invalid Input" | "Exceeds Balance" | "Exceeds Flax Mint Allowance"
export default function MintPanel(props: { flaxAllowance: BigNumber }) {
    const { selectedAssetId, chainId, contracts, account, dynamicTokenInfo } = useBlockchainContext()
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


    useEffect(() => {
        const floatRegex = /^\d+(\.\d+)?$/;
        const validInput = floatRegex.test(mintText) && !isNaN(parseFloat(mintText));
        let reason: invalidReasons = ""
        if (!validInput) {
            reason = "Invalid Input"
        } else if (token) {
            const mintWei = ethers.utils.parseUnits(mintText, 18)
            if (mintWei.gt(dynamicTokenInfo[token.address].balance)) {
                reason = "Exceeds Balance"
            }

        }
        setInvalidReason(reason)
    }, [mintText, props.flaxAllowance])

    useEffect(() => {
        if (chainId && selectedAssetId.length > 2) {
            const currentAssets = (assetJSON as Assets)[chainId]
            const selectedAsset = currentAssets.filter(asset => asset.address === selectedAssetId)[0]
            setAsset(selectedAsset)
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
        if (token) {
            const getApproval = async () => {
                const allowance = await token.allowance(account, contracts.issuer.address)
                setAssetApproved(allowance.gt(ethers.constants.MaxInt256))
            }
            getApproval()
        }
    }, [token, updateChecker])

    const cornerImage = !assetApproved && imagePath !== undefined ? <img src={imagePath || imagePath} style={{ height: `20px` }} /> : <div></div>
    const iconImage = <img src={imagePath} style={{ height: `40px` }} />
    const dynamic = token? dynamicTokenInfo[token.address]:undefined
    const iconTextBox = <IconTextBox text={mintText} setText={setMintText} cornerImage={iconImage} max={dynamic!==undefined ? ethers.utils.formatEther(dynamic.balance) : "0"} invalidReason={invalidReason} />;

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
                    {!assetApproved ? <Typography variant="h5" style={{ textAlign: 'center' }}>
                        Token is not approved
                    </Typography> :
                        <div></div>}
                </Grid>
                <Grid item>
                    {!assetApproved && token ?
                        <TransactionButton progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() => token.approve(contracts.issuer.address, ethers.constants.MaxUint256)} >
                            Approve {asset?.friendlyName} for minting Flax
                        </TransactionButton> : <div>{iconTextBox}</div>}
                </Grid>
                <Grid item>
                    {assetApproved && token && (
                        <TransactionButton progressSetter={setMintProgress} progress={mintProgress} invalid={invalidReason.length > 0} transactionGetter={() => contracts.issuer.issue(token.address, mintText)} >
                            Mint Flax
                        </TransactionButton>
                    )}
                </Grid>
            </Grid>
        </Paper>

    );
}
