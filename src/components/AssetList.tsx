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
import sortAsc from "../images/sortAscending.svg"
import sortDesc from '../images/sortDescending.svg'
import _ from 'lodash';
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

    const [sortDirection, setSortDirection] = useState<boolean>()
    const [approveProgress, setApproveProgress] = useState<TransactionProgress>(TransactionProgress.dormant)
    type Dictionary = {
        [key: string]: number;
    };
    const initialDictionary: Dictionary = assets.map(asset => asset.address).reduce((acc, address) => {
        acc[address] = 0;
        return acc;
    }, {} as Dictionary);

    // Use useState hook with the Dictionary type
    const [assetAPYs, setAssetAPYs] = useState<Dictionary>(initialDictionary);

    // Function to add or update a key-value pair in the dictionary
    const updateDictionary = (key: string) => (value: number) => {
        setAssetAPYs((prevDictionary) => ({
            ...prevDictionary,
            [key]: value,
        }));
    };
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

        <List>
            <ListItem >
                <Grid container wrap="nowrap" alignItems="center" spacing={2}>
                    <Grid item sx={{ width: "150px" }}>
                        <Typography variant="h6" style={{ marginBottom: '10px' }}>Assets</Typography>
                    </Grid>
                    <Grid item xs>
                    </Grid>
                    <Grid item xs >
                        <Grid
                            container
                            direction="row"
                            justifyContent="left"
                            alignItems="center"
                        >
                            <Grid item style={{ width: "110px" }}>

                            </Grid>
                            <Grid item style={{ width: "30px" }} >

                            </Grid>
                            <Grid item style={{ width: "110px" }}>

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Tooltip placement="top" title="Projected annual profit, assuming 180 day lockup. Green is profit, red is loss.">
                                            <Typography style={{ textAlign: "right" }} variant={"h3"}> APY  </Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip placement="top" title={`Sort by APY ${sortDirection ? 'descending' : 'ascending'}. (Button created by Arren. Please thank him)`}>
                                            <img onClick={() => setSortDirection(!sortDirection)} style={{ cursor: "pointer", width: "25px" }} src={sortDirection ?   sortAsc:sortDesc} />
                                        </Tooltip>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </ListItem>
            {assets.sort((a, b) => {
                if (sortDirection === undefined)
                    return 0
                const apyA = assetAPYs[a.address]
                const apyB = assetAPYs[b.address]
                return sortDirection ? apyA - apyB : apyB - apyA
            }).map((asset, index) => (
                <Asset APY={assetAPYs[asset.address]} setAPY={updateDictionary(asset.address)} contracts={props.contracts} key={asset.address}>
                    {asset}
                </Asset>
            ))}

        </List>
        {contracts && contracts.faucet ?
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <TransactionButton progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() => {
                        if (contracts?.faucet) {
                            return contracts.faucet.mint(assets.map(asset => asset.address));
                        } else {
                            return Promise.reject(new Error("Faucet is not available"));
                        }
                    }} >
                        <Tooltip title="Testnet Faucet. Click to mint input tokens">
                            <img src={faucetImg} alt="button" style={{ width: '50px' }} />
                        </Tooltip>
                    </TransactionButton>
                </Grid></Grid>
            : <> </>}
    </Paper>
}

export default AssetList