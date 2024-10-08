/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { FakePair, FakePairInterface } from "../FakePair";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "t0",
        type: "address",
        internalType: "address",
      },
      {
        name: "t1",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "token0",
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
    name: "token1",
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
] as const;

export class FakePair__factory {
  static readonly abi = _abi;
  static createInterface(): FakePairInterface {
    return new utils.Interface(_abi) as FakePairInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FakePair {
    return new Contract(address, _abi, signerOrProvider) as FakePair;
  }
}
