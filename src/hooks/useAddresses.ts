import { useState, useEffect } from 'react';
import { ChainID } from '../types/ChainID';
import { ContractAddresses } from '../types/ContractAddresses';
import _ from 'lodash'
type OptionalAddresses = ContractAddresses | null
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
                        Coupon: '0x0cf758D4303295C43CD95e1232f0101ADb3DA9E8', Issuer: '0x5C758642b0b116632aBc90fFe2C03Ef898753807',
                         Multicall: "0x0", HedgeyAdapter:"0xb2d3445304d40A71A4461CD3A9eCdc44f2479825",
                     
                        Inputs: ['0x155ff1a85f440ee0a382ea949f24ce4e0b751c65', //EYE price = 1
                            '0x1b8568fbb47708e9e9d31ff303254f748805bf21',   //SCX price = 20
                            '0xf047ee812b21050186f86106f6cabdfec35366c6', //SCX/EYE price = 55
                            '0x0287120f9b7d8709b4dD5b589Ae759F79fD34E62', //pyro(SCX/EYE) price =55
                            '0x319ead06eb01e808c80c7eb9bd77c5d8d163addb', //SCX/Eth price = ($1283.924375215) 16691
                            '0xa9EEA8723FffD923F6908586455411159B525d23'] //pyro(scx/ETH) price = 16857
                        //tera mult:1000000000000 = 10^12 so that 1 EYE mints 1 Flax
                    });
                    //input order: EYE, SCX, SCX/EYE,pyro(SCX/EYE), SCX/ETH, pyro(SCX/ETH),
                } else if (chainId === ChainID.sepolia) {
                    // Hardcoded Ethereum addresses for Sepolia
                    setIfNotEqual({
                        Coupon: '0x526C7Efc77A42D46447f45E13B9598919BbB9e4F', Issuer: '0x9616Fc9Bf9b7c2F0Da0342ABf943B18A7190100b', Multicall: "0x0",
                        Faucet:'0x16B0642032F652146534D7A99d6CF3513616Cf97',HedgeyAdapter:"0x36396c4EAE2928747E43C257Fbd7d4bed1b7f570",
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

    return { addresses, loading, error };
};

export default useAddresses;
