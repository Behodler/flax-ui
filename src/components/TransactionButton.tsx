import { ContractTransaction } from 'ethers';
import { Broadcast, IProgressSetter, TransactionProgress } from '../extensions/Broadcast'
import { Box, Button, CircularProgress } from '@mui/material';
import { useBlockchainContext } from '../contexts/BlockchainContextProvider';

interface TransactionButtonProps {
    transactionGetter: () => Promise<ContractTransaction>,
    progress: TransactionProgress
    progressSetter: IProgressSetter,
    invalid?:boolean
    children: any
}

export default function TransactionButton(props: TransactionButtonProps
) {
    const {refreshMultiCalls} = useBlockchainContext()
    const enabled = props.progress === TransactionProgress.dormant && !props.invalid
    let child: any = getChildProps(props.progress, props.children)
    return <Button disabled={!enabled} onClick={() => Broadcast(props.transactionGetter(), props.progressSetter, 5,refreshMultiCalls)}>
        {child}
    </Button>
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