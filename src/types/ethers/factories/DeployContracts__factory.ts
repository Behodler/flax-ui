/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  DeployContracts,
  DeployContractsInterface,
} from "../DeployContracts";

const _abi = [
  {
    type: "function",
    name: "IS_SCRIPT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "run",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export class DeployContracts__factory {
  static readonly abi = _abi;
  static createInterface(): DeployContractsInterface {
    return new utils.Interface(_abi) as DeployContractsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DeployContracts {
    return new Contract(address, _abi, signerOrProvider) as DeployContracts;
  }
}
