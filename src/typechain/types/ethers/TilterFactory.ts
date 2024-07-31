/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface TilterFactoryInterface extends utils.Interface {
  functions: {
    "abandonTilter(address)": FunctionFragment;
    "adoptOrphanTilter(address)": FunctionFragment;
    "configure(address,address,address,address)": FunctionFragment;
    "deploy(address)": FunctionFragment;
    "flax()": FunctionFragment;
    "getEthTilter()": FunctionFragment;
    "oracle()": FunctionFragment;
    "owner()": FunctionFragment;
    "refByTilter(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEnabled(address,bool)": FunctionFragment;
    "setIssuer(address)": FunctionFragment;
    "setOracle(address)": FunctionFragment;
    "tiltersByRef(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "abandonTilter"
      | "adoptOrphanTilter"
      | "configure"
      | "deploy"
      | "flax"
      | "getEthTilter"
      | "oracle"
      | "owner"
      | "refByTilter"
      | "renounceOwnership"
      | "setEnabled"
      | "setIssuer"
      | "setOracle"
      | "tiltersByRef"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "abandonTilter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "adoptOrphanTilter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "configure",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(functionFragment: "deploy", values: [string]): string;
  encodeFunctionData(functionFragment: "flax", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getEthTilter",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "refByTilter", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEnabled",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setIssuer", values: [string]): string;
  encodeFunctionData(functionFragment: "setOracle", values: [string]): string;
  encodeFunctionData(
    functionFragment: "tiltersByRef",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "abandonTilter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "adoptOrphanTilter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "configure", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "flax", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getEthTilter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refByTilter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setEnabled", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setIssuer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tiltersByRef",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface TilterFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TilterFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    abandonTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    adoptOrphanTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    configure(
      tilter: string,
      _flx: string,
      _oracle: string,
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    deploy(
      refToken: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    flax(overrides?: CallOverrides): Promise<[string]>;

    getEthTilter(
      overrides?: CallOverrides
    ): Promise<[string] & { tilter: string }>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    refByTilter(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setEnabled(
      tilter: string,
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setIssuer(
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setOracle(
      _oracle: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    tiltersByRef(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  abandonTilter(
    tilter: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  adoptOrphanTilter(
    tilter: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  configure(
    tilter: string,
    _flx: string,
    _oracle: string,
    _issuer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  deploy(
    refToken: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  flax(overrides?: CallOverrides): Promise<string>;

  getEthTilter(overrides?: CallOverrides): Promise<string>;

  oracle(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  refByTilter(arg0: string, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setEnabled(
    tilter: string,
    enabled: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setIssuer(
    _issuer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setOracle(
    _oracle: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  tiltersByRef(arg0: string, overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    abandonTilter(tilter: string, overrides?: CallOverrides): Promise<void>;

    adoptOrphanTilter(tilter: string, overrides?: CallOverrides): Promise<void>;

    configure(
      tilter: string,
      _flx: string,
      _oracle: string,
      _issuer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    deploy(refToken: string, overrides?: CallOverrides): Promise<void>;

    flax(overrides?: CallOverrides): Promise<string>;

    getEthTilter(overrides?: CallOverrides): Promise<string>;

    oracle(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    refByTilter(arg0: string, overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEnabled(
      tilter: string,
      enabled: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setIssuer(_issuer: string, overrides?: CallOverrides): Promise<void>;

    setOracle(_oracle: string, overrides?: CallOverrides): Promise<void>;

    tiltersByRef(arg0: string, overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    abandonTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    adoptOrphanTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    configure(
      tilter: string,
      _flx: string,
      _oracle: string,
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    deploy(
      refToken: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    flax(overrides?: CallOverrides): Promise<BigNumber>;

    getEthTilter(overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    refByTilter(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setEnabled(
      tilter: string,
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setIssuer(
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setOracle(
      _oracle: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    tiltersByRef(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    abandonTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    adoptOrphanTilter(
      tilter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    configure(
      tilter: string,
      _flx: string,
      _oracle: string,
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    deploy(
      refToken: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    flax(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getEthTilter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    refByTilter(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setEnabled(
      tilter: string,
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setIssuer(
      _issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setOracle(
      _oracle: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    tiltersByRef(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
