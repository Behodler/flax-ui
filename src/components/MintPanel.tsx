import React from 'react';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { Paper } from '@mui/material';

export default function MintPanel() {
    const { selectedAssetId } = useBlockchainContext()


    return <Paper style={{ height: '300px', padding: '20px', backgroundColor: '#1D2833' }}>
        <h1>Selected Asset {selectedAssetId}</h1>
    </Paper>


}