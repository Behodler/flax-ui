/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IssuerJsonAbi, IssuerJsonAbiInterface } from "../IssuerJsonAbi";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "couponAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MaxIssuancePerDay",
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
    name: "issuancePerTokenPerDay",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "runningAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lastIssuedAt",
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
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "setMaxIssuancePerDay",
    inputs: [
      {
        name: "_maxIssuancePerDay",
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
        name: "teraCouponPerToken",
        type: "uint256",
        internalType: "uint256",
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
        name: "teraCouponPerToken",
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
      {
        name: "runningAmount",
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
] as const;

export class IssuerJsonAbi__factory {
  static readonly abi = _abi;
  static createInterface(): IssuerJsonAbiInterface {
    return new utils.Interface(_abi) as IssuerJsonAbiInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IssuerJsonAbi {
    return new Contract(address, _abi, signerOrProvider) as IssuerJsonAbi;
  }
}
