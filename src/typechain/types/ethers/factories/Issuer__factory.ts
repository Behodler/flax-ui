/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Issuer, IssuerInterface } from "../Issuer";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "couponAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "streamAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "couponContract",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ICoupon",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentPrice",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "teraCouponPerToken",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "issue",
    inputs: [
      {
        name: "inputToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "nft",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lockupDuration",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mintAllowance",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCouponContract",
    inputs: [
      {
        name: "newCouponAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLimits",
    inputs: [
      {
        name: "allowance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lockupDuration_Days",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_targetedMintsPerday",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTokenInfo",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "enabled",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "burnable",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "startingRate",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTokensInfo",
    inputs: [
      {
        name: "tokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "enabled",
        type: "bool[]",
        internalType: "bool[]",
      },
      {
        name: "burnable",
        type: "bool[]",
        internalType: "bool[]",
      },
      {
        name: "startingRate",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "whitelist",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "enabled",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "burnable",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "lastminted_timestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "teraCouponPerTokenPerSecond",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CouponsIssued",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coupons",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenWhitelisted",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "enabled",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "burnable",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "teraCouponPerToken",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensWhiteListed",
    inputs: [
      {
        name: "tokens",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "burnable",
        type: "bool[]",
        indexed: false,
        internalType: "bool[]",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ExcessiveMinting",
    inputs: [
      {
        name: "attemptedAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "remaining",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidMintTarget",
    inputs: [
      {
        name: "target",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
] as const;

export class Issuer__factory {
  static readonly abi = _abi;
  static createInterface(): IssuerInterface {
    return new utils.Interface(_abi) as IssuerInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Issuer {
    return new Contract(address, _abi, signerOrProvider) as Issuer;
  }
}
