/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MathSolMathAbi,
  MathSolMathAbiInterface,
} from "../MathSolMathAbi";

const _abi = [
  {
    type: "error",
    name: "MathOverflowedMulDiv",
    inputs: [],
  },
] as const;

export class MathSolMathAbi__factory {
  static readonly abi = _abi;
  static createInterface(): MathSolMathAbiInterface {
    return new utils.Interface(_abi) as MathSolMathAbiInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MathSolMathAbi {
    return new Contract(address, _abi, signerOrProvider) as MathSolMathAbi;
  }
}