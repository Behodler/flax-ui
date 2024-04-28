import { ContractTransaction } from 'ethers';

export default function Broadcast(transaction: Promise<ContractTransaction>, onInitiate: () => void, onSign: () => void, onSuccess: () => void, onReject: () => void, onFail: () => void) {
    onInitiate()
    transaction.then((tx) => {
        onSign()
        tx.wait().then(onSuccess)
        .catch(onFail)
    }).catch(onReject)
}