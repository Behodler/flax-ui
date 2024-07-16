import React, { useEffect, useState } from 'react';
import { Grid, Container, Box, Paper, Typography } from '@mui/material';
import BalanceHeader
  from './BalanceHeader';
import AssetList from './AssetList';
import MintPanel from './MintPanel';
import { BigNumber } from 'ethers';
import { useBlockNumber } from '@usedapp/core';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { LiveProps } from '../extensions/LiveProps';
import { ChainID, supportedChain } from '../types/ChainID';
const MinterPage = () => {

  const blockNumber = useBlockNumber()
  const { contracts, chainId, account } = useBlockchainContext()
  const [liveProps, setLiveProps] = useState<LiveProps | undefined>()
  const [loadingMessage, setLoadingMessage] = useState<string>("")
  useEffect(() => {
    if (contracts && chainId && account && supportedChain(chainId)) {
      setLiveProps({ chainId, account, contracts })
    } else {
      if (supportedChain(chainId)) {
        setLoadingMessage("Loading...")
      } else {
        if (chainId == ChainID.disconnected) {
          setLoadingMessage("Metamask not connected")
        } else if (chainId == ChainID.absent) {
          setLoadingMessage("Dapp presently requires Metamask only")
        } else if (chainId == ChainID.unsupported) {
          setLoadingMessage("Please switch to one of the following networks: Sepolia or Mainnet")
        }
      }
      setLiveProps(undefined)
    }
  }, [contracts, account, chainId])

  //logic for when contracts, chainId and account are all not null
  const BalanceHeaderLive = liveProps ? <BalanceHeader {...liveProps} /> : <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
    style={{ height: '100%' }}
  >
    <Grid item>
      <Typography variant="h2">{loadingMessage}</Typography>
    </Grid>
  </Grid>
  const AssetListLive = liveProps ? <AssetList {...liveProps} /> : <div></div>
  const MintPanelLive = liveProps ? <MintPanel {...liveProps} /> : <div></div>
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={0} sx={{ backgroundColor: '#0D131A', width: '100vw', minHeight: '100vh', boxSizing: 'border-box' }}>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1280, flexBasis: 1280 }}>
          <Box id="box" sx={{ minHeight: '100%', width: '100%', color: 'white', padding: 4, backgroundColor: '#0D131A', boxSizing: 'border-box' }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item style={{ height: '130px' }}>
                {BalanceHeaderLive}
              </Grid>


              <Grid item >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="top"
                >
                  <Grid item sx={{ width: '750px' }}>
                    {AssetListLive}
                  </Grid>
                  <Grid item sx={{ width: '440px' }}>
                    {MintPanelLive}
                  </Grid>
                </Grid>
              </Grid>


            </Grid>

          </Box>
        </Grid>
        <Grid item xs={false} sm={1} md={true} style={{ flexGrow: 1 }} />
      </Grid>
    </Container>
  );
};

export default MinterPage;
