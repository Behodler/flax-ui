import { ContractTransaction } from 'ethers';
import { Broadcast, IProgressSetter, TransactionProgress } from '../extensions/Broadcast'
import { Box, Button, CircularProgress } from '@mui/material';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';
import Toasty from './Toasty';
import { useState } from 'react';

interface TransactionButtonProps {
    transactionGetter: () => Promise<ContractTransaction>,
    progress: TransactionProgress
    progressSetter: IProgressSetter,
    toastyEnabled: boolean,
    invalid?: boolean
    children: any
}

export default function TransactionButton(props: TransactionButtonProps
) {

    const { refreshMultiCalls } = useBlockchainContext()
    const [showToasty, setShowToasty] = useState<boolean>(false)
    const triggerToasty = props.toastyEnabled ? setShowToasty : (v: boolean) => { }
    const enabled = props.progress === TransactionProgress.dormant && !props.invalid
    let child: any = getChildProps(props.progress, props.children)
    return <>
        <Toasty show={showToasty} setShow={setShowToasty} />
        <Button disabled={!enabled} onClick={() => Broadcast(props.transactionGetter(), props.progressSetter, 5, refreshMultiCalls, triggerToasty)}>
            {child}
        </Button>
    </>


}


function getChildProps(progress: TransactionProgress, dormant: any) {
    switch (progress) {
        case TransactionProgress.dormant:
            return dormant
        case TransactionProgress.triggered:
            return getCircleBox("Awaiting signature")
        case TransactionProgress.signed:
            return getCircleBox("Confirming transaction")
        case TransactionProgress.confirmed:
            return "Confirmed"
        case TransactionProgress.failed:
            return "Transaction failed"
        case TransactionProgress.rejected:
            return "User cancelled transaction"
        default:
            return dormant
    }
}

function getCircleBox(text: String) {
    return <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div>{text}</div>
        <CircularProgress size={20} />
    </Box>
}