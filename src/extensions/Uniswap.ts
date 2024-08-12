import { BigNumber, Contract, ethers } from "ethers";
import { ERC20 } from "../typechain/types/ethers";
import { AMM } from "../types/Assets";
import Assets from "../constants/AssetLists.json"
import { ChainID } from "../types/ChainID";
import ABIs from "../constants/ABIs.json"
import { ChainId, Token, WETH9, CurrencyAmount } from '@uniswap/sdk-core'
import { Pair, Route } from "@uniswap/v2-sdk";
import UniV2PairABI from '../constants/UniV2PairABI.json'

async function getEthPrice(token: string, provider: ethers.providers.Web3Provider, AMMs: AMM[]): Promise<BigNumber | undefined> {
    const isPyro = AMMs.findIndex(amm => amm.type === "pyro") !== -1
    const isLP = AMMs.findIndex(amm => amm.type === "LP" && amm.location == "uni") !== -1

    //for independent tokens like Dai, AMMs.length == 0
    const isBase = AMMs.length == 0 || AMMs.findIndex(amm => amm.type === "base") !== -1
    let price: BigNumber | undefined
    if (isPyro) {
        const abi = [
            "function redeemRate() view returns (uint256)",
            "function config() view returns (address, address, address, bool)"
        ];
        const contract = new ethers.Contract(token, abi, provider);
        const redeemRate = (await contract.redeemRate()) as BigNumber;
        const config = await contract.config()
        const baseToken = config[1] as string

        const amms = matchingAssetAMMs(baseToken)

        const innerEthPrice = await getEthPrice(baseToken, provider, amms)

        if (innerEthPrice) {
            price = redeemRate.mul(innerEthPrice).div(ethers.constants.WeiPerEther)
        }

    } else if (isLP) {
        const url = AMMs.filter(amm => amm.type == "LP")[0].url
        const tokenPart = url.substring(7)
        const divider = tokenPart.indexOf('/')
        const token1 = tokenPart.substring(0, divider)
        const token2 = tokenPart.substring(divider + 1)
        const LP = token;

        const token1AMMs = matchingAssetAMMs(token1)
        const token2AMMs = matchingAssetAMMs(token2)

        const token1Price = await getEthPrice(token1, provider, token1AMMs)
        const token2Price = await getEthPrice(token2, provider, token2AMMs)

        if (token1Price && token2Price) {
            const token1BalanceOnLP = await balanceOf(token1, LP, provider)
            const token2BalanceOnLP = await balanceOf(token2, LP, provider)
            const ethVal = (token1Price.mul(token1BalanceOnLP).add(token2Price.mul(token2BalanceOnLP)))
            const totalSupplyOfLP = await totalSupply(LP, provider)

            price = ethVal.div(totalSupplyOfLP)
        }
        //dissaggregate into base tokens and recursively get prices
    } else if (isBase) {

        //get direct eth price from Uniswap. Use SDK docs and provider object
        if (token === "ETH") {
            return ethers.constants.WeiPerEther
        }
        else {
            //FIRST GET UNISWAP ETH PAIR
            const uniToken = new Token(ChainId.MAINNET, token, 18)
            try {
                if (uniToken.address.toLowerCase() === WETH9[uniToken.chainId].address.toLowerCase()) {
                    return ethers.constants.WeiPerEther
                }
                const pairAddress = Pair.getAddress(uniToken, WETH9[uniToken.chainId])
                const pairContract = new ethers.Contract(pairAddress, UniV2PairABI.abi, provider)
                const reserves = await pairContract["getReserves"]()
                const [reserve0, reserve1] = reserves
                const tokens = [uniToken, WETH9[uniToken.chainId]]
                const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

                const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))


                //next construct trade route of input: token, output: weth to get weth price
                const route = new Route([pair], uniToken, WETH9[uniToken.chainId])
                //Eth per token
                price = ethers.utils.parseUnits(route.midPrice.toSignificant(6), 18);
            } catch (e) {
                throw 'error in isBase: ' + e
            }
        }
    }
    return price
}

async function getDaiPriceOfEth(provider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18)
    const pairAddress = Pair.getAddress(DAI, WETH9[DAI.chainId])

    // Setup provider, import necessary ABI ...
    const pairContract = new ethers.Contract(pairAddress, UniV2PairABI.abi, provider)
    const reserves = await pairContract["getReserves"]()
    const [reserve0, reserve1] = reserves

    const tokens = [DAI, WETH9[DAI.chainId]]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

    const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
    const route = new Route([pair], WETH9[DAI.chainId], DAI)

    return ethers.utils.parseUnits(route.midPrice.toSignificant(18), 18);
}

async function getDaiPriceOfToken(token: string, provider: ethers.providers.Web3Provider, currentChainId: ChainID, daiPriceOfEth?: BigNumber): Promise<BigNumber | undefined> {
    if (currentChainId == ChainID.mainnet) {
        const ethPriceOfToken = await getEthPrice(token, provider, matchingAssetAMMs(token));

        if (ethPriceOfToken) {
            // log('Eth price ' + ethers.utils.formatEther(ethPriceOfToken))
            const daiPrice = daiPriceOfEth || await getDaiPriceOfEth(provider)
            return daiPrice.mul(ethPriceOfToken).div(ethers.constants.WeiPerEther)
        }
    }
    return undefined
}

async function balanceOf(token: string, contract: string, provider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const signer = provider.getSigner();
    const erc20 = new Contract(
        token,
        ABIs.ERC20,
        signer
    ) as unknown as ERC20
    return await erc20.balanceOf(contract)
}


async function totalSupply(token: string, provider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const signer = provider.getSigner();
    const erc20 = new Contract(
        token,
        ABIs.ERC20,
        signer
    ) as unknown as ERC20
    return await erc20.totalSupply()
}

const matchingAssetAMMs = (address: string): AMM[] => {
    const matchingAsset = Assets["1"].find(asset => asset.address.toLowerCase() === address.toLowerCase());
    let amms: AMM[] = []
    if (matchingAsset && matchingAsset.AMMs) {
        amms = matchingAsset.AMMs as AMM[]
    }
    return amms;
}



export { getEthPrice, getDaiPriceOfEth, getDaiPriceOfToken }