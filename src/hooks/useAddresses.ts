import { useState, useEffect } from 'react';
import { ChainID } from '../types/ChainID';
import { ContractAddresses } from '../types/ContractAddresses';
import _ from 'lodash'
export type OptionalAddresses = ContractAddresses | null
const useAddresses = (chainId: ChainID): { addresses: OptionalAddresses, loading: boolean, error: string | null } => {
    const [addresses, setAddresses] = useState<ContractAddresses | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const setIfNotEqual = (newAddresses: OptionalAddresses) => {
        if (!_.isEqual(newAddresses, addresses)) {
            setAddresses(newAddresses)
        }
    }

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                if (chainId === ChainID.anvil) {
                    const response = await fetch('http://localhost:3010/api/contract-addresses', { mode: 'cors', method: 'GET', credentials: "omit", cache: "no-cache" })
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data: ContractAddresses = await response.json();
                    setIfNotEqual(data)
                } else if (chainId === ChainID.mainnet) {
                    // Hardcoded Ethereum addresses for Mainnet
                    setIfNotEqual({
                        Coupon: '0x0cf758D4303295C43CD95e1232f0101ADb3DA9E8', Issuer: '0xDf998917f61091958FeB554EDFf56aDd2fe0dF77',
                        Multicall: "0x0",Dai:'0x6B175474E89094C44Da98b954EedeAC495271d0F', HedgeyAdapter: "0xb2d3445304d40A71A4461CD3A9eCdc44f2479825", Multicall3: "0xcA11bde05977b3631167028862bE2a173976CA11",
                        Weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', UniPriceFetcher: '0x679f5bD341521573a023B77076142854abcb1A98', UniswapV2Router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', TilterFactory: '0xB8cF96fa4259b03C09050bD251bcac44d9523E39',
                        Inputs: ['0x155ff1a85f440ee0a382ea949f24ce4e0b751c65', //EYE price = 1
                            '0x1b8568fbb47708e9e9d31ff303254f748805bf21',   //SCX price = 20
                            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', //WETH, 0x6dF6B57FB7c35D7C71395F77cb08b82A62635e19
                            '0xf047ee812b21050186f86106f6cabdfec35366c6', //SCX/EYE price = 55
                            '0x0287120f9b7d8709b4dd5b589ae759f79fd34e62', //pyro(SCX/EYE) price =55
                            '0x319ead06eb01e808c80c7eb9bd77c5d8d163addb', //SCX/Eth price = ($1283.924375215) 16691
                            '0xa9eea8723fffd923f6908586455411159b525d23', //pyro(scx/ETH) price = 16857
                            '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI, 0x85fa95c7ec636ffd320e25b43b4e37df8479c56c
                            '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', //SHIB, 0xAbB2223f54499b9FF2807C8d556dA65B555c30e7
                            '0x0cf758d4303295c43cd95e1232f0101adb3da9e8',
                        '0x54965801946d768b395864019903aef8b5b63bb3'] //Flax

                        //tera mult:1000000000000 = 10^12 so that 1 EYE mints 1 Flax
                    });
                    //input order: EYE, SCX, SCX/EYE,pyro(SCX/EYE), SCX/ETH, pyro(SCX/ETH),
                } else if (chainId === ChainID.sepolia) {
                    // Hardcoded Ethereum addresses for Sepolia
                    setIfNotEqual({
                        Coupon: '0x526C7Efc77A42D46447f45E13B9598919BbB9e4F', Issuer: '0xFaC63FB20DA71248C7fc778C6FD89D4b7a4220F5', Multicall: "0x0",
                        Faucet: '0x16B0642032F652146534D7A99d6CF3513616Cf97',Dai:'NOTSET', HedgeyAdapter: "0x36396c4EAE2928747E43C257Fbd7d4bed1b7f570",
                        Multicall3: "0xcA11bde05977b3631167028862bE2a173976CA11", UniPriceFetcher: 'NOTSET', Weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', TilterFactory: 'NOTSET', UniswapV2Router: 'NOTSET',
                        Inputs: ['0xc4171cB917Db366BBcB84aF3472CB63BB0f3a554', //EYE price = 1
                            '0x594d83f99a0339d7FA867F746f8Af91DC4562FC9',   //SCX price = 20
                            '0xdA479c034876Ee72105a7E536d9077d0b18A68a5', //SCX/EYE price = 55
                            '0x1070a8B8E83A58856F6a21682868eAf0dc09e6C3' //SCX/Eth price = ($1283.924375215) 16691
                        ] //pyro(scx/ETH) price = 16857
                        //tera mult:1000000000000 = 10^12 so that 1 EYE mints 1 Flax
                    });
                    //input order: EYE, SCX, SCX/EYE,pyro(SCX/EYE), SCX/ETH, pyro(SCX/ETH),
                }

            } catch (e) {
                setError((e as any).message);
                setIfNotEqual(null)
            } finally {
                setLoading(false);
            }
        };
        if (chainId !== ChainID.absent && chainId !== ChainID.disconnected)
            fetchAddresses();
    }, [chainId]); // Depend on chainId to refetch when it changes
    useEffect(() => {
        if (addresses) {
            const notSetKeys = Object.keys(addresses).filter(k => {
                const key = k as keyof ContractAddresses;
                return addresses[key] === 'NOTSET';
            });
            if (notSetKeys.length > 0) {
                throw Error("The following addresses have not been set: " + JSON.stringify(notSetKeys))
            }
        }
    }, [addresses])
    return { addresses, loading, error };
};

export default useAddresses;
