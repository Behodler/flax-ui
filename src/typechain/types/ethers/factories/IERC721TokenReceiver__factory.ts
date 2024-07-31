/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IERC721TokenReceiver,
  IERC721TokenReceiverInterface,
} from "../IERC721TokenReceiver";

const _abi = [
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      {
        name: "_operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "_from",
        type: "address",
        internalType: "address",
      },
      {
        name: "_tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;

export class IERC721TokenReceiver__factory {
  static readonly abi = _abi;
  static createInterface(): IERC721TokenReceiverInterface {
    return new utils.Interface(_abi) as IERC721TokenReceiverInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC721TokenReceiver {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IERC721TokenReceiver;
  }
}
