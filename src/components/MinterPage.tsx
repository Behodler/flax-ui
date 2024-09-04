import React, { useEffect, useState } from 'react';
import { Grid, Container, Box, Paper, Typography, Button } from '@mui/material';
import BalanceHeader
  from './BalanceHeader';
import AssetList from './AssetList';
import MintPanel from './MintPanel';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import { LiveProps } from '../extensions/LiveProps';
import { ChainID, supportedChain } from '../types/ChainID';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const MinterPage = () => {
  const { contracts, chainId, account, accountIsOwner, tilterBalanceMapping } = useBlockchainContext()
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
          setLoadingMessage("Wallet not connected")
        } else if (chainId == ChainID.absent) {
          setLoadingMessage("Dapp presently requires a popular crypto wallet")
        } else if (chainId == ChainID.unsupported) {
          setLoadingMessage("Please switch to Mainnet")
        }
      }
      setLiveProps(undefined)
    }
  }, [contracts, account, chainId])
  const heightOfBalanceHeader = `${(accountIsOwner ? 300 : 0) + 130}px`
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

        <Grid item xs={12} sm={10} md={false} style={{ maxWidth: 1400, flexBasis: 1400 }}>
          <Box id="box" sx={{ minHeight: '100%', width: '100%', color: 'white', padding: 4, backgroundColor: '#0D131A', boxSizing: 'border-box' }}>

            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item>

              </Grid>
              <Grid item style={{ height: heightOfBalanceHeader }}>
                {BalanceHeaderLive}
              </Grid>


              <Grid item >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="top"
                >
                  <Grid item sx={{ width: '850px' }}>

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
