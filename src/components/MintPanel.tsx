import React, { useEffect, useState } from 'react';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { getImagePath } from '../extensions/ImageMapper';
import assetJSON from "../constants/AssetLists.json"
import { AssetProps, Assets } from '../types/Assets';
import { ERC20 } from '../../types/ethers';
import { ethers } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import TransactionButton from './TransactionButton';
import { IProgressSetter, TransactionProgress } from '../extensions/Broadcast';
import IconTextBox from './IconTextBox';

export default function MintPanel() {
    const { selectedAssetId, chainId, contracts, account } = useBlockchainContext()
    const blockNumber = useBlockNumber()
    const [asset, setAsset] = useState<AssetProps>()
    const [token, setToken] = useState<ERC20>()
    const [updateChecker, setUpdateChecker] = useState<number>(0)
    const [assetApproved, setAssetApproved] = useState<boolean>(false)
    // Initialize imageGetter with a default function that returns an empty <div>
    const [imagePath, setImagePath] = useState<any>()
    const [approveProgress, setApproveProgress] = useState<TransactionProgress>(TransactionProgress.dormant)

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
    const cornerImage = !assetApproved && imagePath !== undefined ? <img src={imagePath.default || imagePath} style={{ height: `20px` }} /> : <div></div>
   const iconImage = <img src={imagePath.default || imagePath} style={{ height: `40px` }} />
    const iconTextBox =  <IconTextBox cornerImage={iconImage} />;
   
    return (
        <Paper style={{ height: '300px', padding: '20px', backgroundColor: '#1D2833' }}>
            <Grid
                container
                direction="column"
                justifyContent="stretch"  // Ensures vertical stretching
                alignItems="center"
                spacing={4}
                
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
            </Grid>
        </Paper>

    );
}
