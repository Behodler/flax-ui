import React, { useEffect, useState } from 'react';
import assetJSON from "../constants/AssetLists.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { Paper, Typography, List, ListItem, ListItemButton, Box, styled, Button, Tooltip, Grid } from '@mui/material';
import { Asset } from './Asset';
import { AssetProps, Assets } from '../types/Assets';
import { LiveProps } from '../extensions/LiveProps';
import faucetImg from "../images/faucet.png"
import { CottageRounded, Title } from '@mui/icons-material';
import TransactionButton from './TransactionButton';
import { TransactionProgress } from '../extensions/Broadcast';


const assetList = assetJSON as Assets
const loadList = (chainId: number | undefined) => {
    if (chainId) {
        return assetList[chainId.toString()]
    }
    return []
}

const AssetList = (props: LiveProps) => {

    const { setSelectedAssetId } = useBlockchainContext()
    const { chainId } = props
    const { contracts } = useBlockchainContext()
    const [assets, setAssets] = useState<AssetProps[]>(loadList(chainId))
    
    const [approveProgress, setApproveProgress] = useState<TransactionProgress>(TransactionProgress.dormant)
    useEffect(() => {
        if (chainId) {
            const currentAssets = assetList[chainId.toString()]
            setAssets(currentAssets)
            setSelectedAssetId(currentAssets[0].address)
        }
    }, [chainId])

    const ImageButton = styled(Button)({
        padding: 0,
        width: "25px",
        marginTop: '100px'
    });

    return <Paper style={{ padding: '20px', backgroundColor: '#1D2833', color: 'white', minHeight: "500px" }}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>Assets</Typography>
        <List>
            {assets.map((asset, index) => (
                <Asset contracts={props.contracts} key={index}>
                    {asset}
                </Asset>
            ))}

        </List>
{contracts?
        <Grid container justifyContent="flex-end">
            <Grid item>
            <TransactionButton progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() =>contracts.faucet.mint(assets.map(asset=>asset.address))} >
            <Tooltip title="Testnet Faucet. Click to mint input tokens">
                        <img src={faucetImg} alt="button" style={{ width: '50px' }} />
                    </Tooltip>
                                </TransactionButton>
                {/* <ImageButton onClick={() => alert('clicked')}>
                    
                </ImageButton> */}
            </Grid></Grid>
:<> </>}
    </Paper>
}

export default AssetList