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
import { calculateLockupDuration, isEthAddress } from '../extensions/Utils';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';
import useEthBalance from '../hooks/useEthBalance';
import { IssueSignature } from '../hooks/useDynamicTokenInfo';
import treasure from '../images/eye-treasure.png'

const validateMintText = (text: string) => {
    const floatRegex = /^\d+(\.\d+)?$/;
    return floatRegex.test(text) && !isNaN(parseFloat(text));
}

export default function MintPanel(props: LiveProps) {
    const [inputBalance, setInputBalance] = useState<BigNumber>();
    const { contracts, account, chainId } = props
    const { selectedAssetId, dynamicTokenInfo, flxDollarPrice,
        tokenLockupConfig, isEth, inputDollarPrices, rewardConfig, customRewardBalance, rewardTokenName } = useBlockchainContext()
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
    const dynamic = token && dynamicTokenInfo ? dynamicTokenInfo[token.address] : undefined
    const issueFunction: IssueSignature = dynamic ? dynamic.issue : (inputToken: string, amount: BigNumber, recipient: string) => Promise.resolve(() => { console.log('issue function not defined') })
    const approvalAddress = dynamic === undefined ? contracts.issuer.address : dynamic.issuerToApprove
    const [inputDollarPrice, setInputDollarPrice] = useState<BigNumber | undefined>()
    const [lockupDuration, setLockupDuration] = useState<number>(tokenLockupConfig.offset);
    const [dollarValueOfInputText, setDollarValueOfInputText] = useState<string | undefined>()
    const ethBalance = useEthBalance(account)

    useEffect(() => {
        if (inputDollarPrices) {
            setInputDollarPrice(inputDollarPrices[selectedAssetId])
        }
    }, [inputDollarPrices])

    useEffect(() => {
        if (mintProgress === TransactionProgress.confirmed) {
            setMintText("0")
            setFlaxToMint("")
        }
    }, [mintProgress])

    useEffect(() => {
        if (isEthAddress(selectedAssetId) && isEthAddress(account)) {

            const selectedInput = contracts.inputs.find(input => input.address === selectedAssetId)
            if (selectedInput) {
                const getBalance = async () => {
                    if (isEth(selectedAssetId)) {
                        setInputBalance(ethBalance)
                    }
                    else setInputBalance(await selectedInput.balanceOf(account).catch())
                }
                try {
                    getBalance()
                } catch { }
            }
        }
    }, [selectedAssetId, account])
    const [rewardText, setRewardText] = useState<string>()

    useDeepCompareEffect(() => {
        if (dynamic && rewardConfig.token && flaxToMint) {
            const mintWei = ethers.utils.parseUnits(flaxToMint, 18)
            const bigFlaxToMint = BigNumber.from(mintWei)
            if (rewardConfig.token.address !== ethers.constants.AddressZero
                && rewardConfig.rewardSize.gt(0)
                && customRewardBalance.gte(rewardConfig.rewardSize)
                && dynamic.rewardEnabled
                && bigFlaxToMint.gte(rewardConfig.minFlax)) {
                //Need token Name
                setRewardText(`${parseFloat(ethers.utils.formatEther(rewardConfig.rewardSize)).toFixed(0)} ${rewardTokenName} bonus reward`)
            }
            else {
                setRewardText(undefined)
            }
        }

    }, [customRewardBalance, rewardConfig, dynamic && flaxToMint])

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
                    setLockupDuration(calculateLockupDuration(divTera, tokenLockupConfig))
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
                setLockupDuration(tokenLockupConfig.offset)
            }
        }
    }, [mintText, invalidReason, blockNumber, inputBalance, dynamic, inputDollarPrice])

    const validateInput = (mintWei: BigNumber, flaxToMint: BigNumber) => {
        if (inputBalance && mintWei.gt(inputBalance)) {
            setInvalidReason("Exceeds Balance")
        }
        else setInvalidReason("")
    }

    useEffect(() => {
        if (chainId && selectedAssetId.length > 2) {
            const currentAssets = (assetJSON as Assets)[chainId]
            const selectedAsset = currentAssets.filter(asset => asset.address === selectedAssetId)[0]
            setAsset(selectedAsset)
            setMintText("0")
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
        const effectiveMintText = mintText.trim() === "" ? "0" : mintText

        if (token && validateMintText(effectiveMintText)) {
            if (isEth(token.address)) {
                setAssetApproved(true)
            } else {

                const getApproval = async () => {
                    const allowance = await token.allowance(account, approvalAddress)
                    const mintWei = ethers.utils.parseUnits(effectiveMintText, 18)
                    setAssetApproved(allowance.gte(mintWei))
                }
                getApproval()
            }
        }
    }, [token, updateChecker, mintText])

    const cornerImage = !assetApproved && imagePath !== undefined ? <img src={imagePath || imagePath} style={{ height: `20px`, borderRadius: '10px' }} /> : <div></div>
    const iconImage = <img src={imagePath} style={{ height: `40px`, borderRadius: "25px" }} />

    const iconTextBox = <IconTextBox dollarValueOfInput={dollarValueOfInputText} text={mintText} setText={setMintText} cornerImage={iconImage} max={dynamic !== undefined ? ethers.utils.formatEther(dynamic.balance) : "0"} invalidReason={invalidReason} />;
    const mintValue = validateMintText(mintText) ? ethers.utils.parseEther(mintText) : BigNumber.from(0);
    const rewardImage = rewardText?<img src={treasure} style={{width:"20px",margin:'0 5px'}} />:undefined
    return (
        <Paper style={{ height: '320px', padding: '20px', backgroundColor: '#1D2833' }}>
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
                                        <TransactionButton toastyEnabled={true} progressSetter={setMintProgress} progress={mintProgress} invalid={invalidReason.length > 0} transactionGetter={() => issueFunction(token.address, mintValue, account, { value: isEth(selectedAssetId) ? mintValue : 0 })} >
                                            Mint {flaxToMint !== "" ? parseFloat(flaxToMint).toFixed(4) : ""} Flax {mintDai && mintDai !== "" ? '($' + mintDai + ')' : ''}
                                        </TransactionButton>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            (streamed over {lockupDuration} days)
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='h5' sx={{color:'#DAA520',marginTop:'5px', fontWeight:'bold'}}>
                                        {rewardImage}{rewardText}{rewardImage}
                                        </Typography>
                                    </Grid>
                                    {
                                        lockupDuration > tokenLockupConfig.offset ? <Grid item>
                                            <Typography variant='h5' sx={{ color: '#FA8072', mt: 1 }}>
                                                Warning: lock time extended for large minting.
                                            </Typography>
                                        </Grid>
                                            : <></>
                                    }
                                </Grid>
                                :
                                <TransactionButton toastyEnabled={false} progressSetter={setApproveProgress} progress={approveProgress} transactionGetter={() => token.approve(approvalAddress, ethers.constants.MaxUint256)} >
                                    Approve {asset?.friendlyName} for minting Flax
                                </TransactionButton>
                            }
                        </Grid>

                    </>)}
            </Grid>
        </Paper>

    );
}
