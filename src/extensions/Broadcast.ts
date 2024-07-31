import { ContractTransaction } from 'ethers';
export enum TransactionProgress {
    dormant,
    triggered,
    signed,
    confirmed,
    rejected,
    failed
}

export interface IProgressSetter {
    (state: TransactionProgress): void
}

export function Broadcast(transaction: Promise<ContractTransaction>, setProgress: IProgressSetter, endTimeout: number, refreshMultiCalls: () => void,showToasty:(v:boolean)=>void ){
    setProgress(TransactionProgress.triggered)
    transaction.then((tx) => {
        setProgress(TransactionProgress.signed)
        tx.wait().then(() => {
            showToasty(true);
            setProgress(TransactionProgress.confirmed)
            setTimeout(() => {
                setProgress(TransactionProgress.dormant)
                refreshMultiCalls()
            }, endTimeout * 1000)
        })
            .catch(() => {
                setProgress(TransactionProgress.failed)
                setTimeout(() => {
                    setProgress(TransactionProgress.dormant)
                }, endTimeout * 1000)
            })
    }).catch(() => {
        setProgress(TransactionProgress.rejected)
        setTimeout(() => {
            setProgress(TransactionProgress.dormant)
        }, endTimeout * 1000)
    })


}
