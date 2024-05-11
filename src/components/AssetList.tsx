import React, { useEffect, useState } from 'react';
import assetJSON from "../constants/AssetLists.json"
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { Paper, Typography, List, ListItem, ListItemButton } from '@mui/material';
import { Asset } from './Asset';
import { AssetProps, Assets } from '../types/Assets';



const assetList = assetJSON as Assets
const loadList = (chainId: number | undefined) => {
    if (chainId) {
        return assetList[chainId.toString()]
    }
    return []
}

const AssetList = () => {

    const { chainId,setSelectedAssetId } = useBlockchainContext()
    const [assets, setAssets] = useState<AssetProps[]>(loadList(chainId))
    useEffect(() => {
        if (chainId){
            const currentAssets = assetList[chainId.toString()]
            setAssets(currentAssets)
            setSelectedAssetId(currentAssets[0].address)
        }
    }, [chainId])

    return <Paper style={{ padding: '20px', backgroundColor: '#1D2833', color: 'white', minHeight: "500px" }}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>Assets</Typography>
        <List>
            {assets.map((asset, index) => (
                <Asset key={index}>
                    {asset}
                </Asset>
            ))}
        </List>
    </Paper>
}

export default AssetList