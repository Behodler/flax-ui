/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IUniswapV2Router02,
  IUniswapV2Router02Interface,
} from "../IUniswapV2Router02";

const _abi = [
  {
    type: "function",
    name: "WETH",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address",
      },
      {
        name: "amountADesired",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountBDesired",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountAMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountBMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountA",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountB",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addLiquidityETH",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "amountTokenDesired",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountTokenMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETHMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountToken",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETH",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "factory",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAmountIn",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getAmountOut",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getAmountsIn",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAmountsOut",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "quote",
    inputs: [
      {
        name: "amountA",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveA",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "reserveB",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountB",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "removeLiquidity",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountAMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountBMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountA",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountB",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLiquidityETH",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountTokenMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETHMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountToken",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETH",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLiquidityETHSupportingFeeOnTransferTokens",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountTokenMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETHMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountETH",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLiquidityETHWithPermit",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountTokenMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETHMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "approveMax",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "v",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "r",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "amountToken",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETH",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountTokenMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountETHMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "approveMax",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "v",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "r",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "amountETH",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLiquidityWithPermit",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountAMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountBMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "approveMax",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "v",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "r",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "amountA",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountB",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapETHForExactTokens",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "swapExactETHForTokens",
    inputs: [
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
    inputs: [
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "swapExactTokensForETH",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapExactTokensForTokens",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    inputs: [
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountOutMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapTokensForExactETH",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountInMax",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapTokensForExactTokens",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amountInMax",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "path",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;

export class IUniswapV2Router02__factory {
  static readonly abi = _abi;
  static createInterface(): IUniswapV2Router02Interface {
    return new utils.Interface(_abi) as IUniswapV2Router02Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUniswapV2Router02 {
    return new Contract(address, _abi, signerOrProvider) as IUniswapV2Router02;
  }
}
