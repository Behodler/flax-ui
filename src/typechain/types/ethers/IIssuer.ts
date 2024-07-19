/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
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

export interface IIssuerInterface extends utils.Interface {
  functions: {
    "currentPrice(address)": FunctionFragment;
    "issue(address,uint256,address)": FunctionFragment;
    "setCouponContract(address)": FunctionFragment;
    "setLimits(uint256,uint256,uint256,uint256)": FunctionFragment;
    "setTokenInfo(address,bool,bool,uint256)": FunctionFragment;
    "setTokensInfo(address[],bool[],bool[],uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "currentPrice"
      | "issue"
      | "setCouponContract"
      | "setLimits"
      | "setTokenInfo"
      | "setTokensInfo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "currentPrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "issue",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setCouponContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setLimits",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenInfo",
    values: [string, boolean, boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokensInfo",
    values: [string[], boolean[], boolean[], BigNumberish[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "currentPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCouponContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setLimits", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTokenInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokensInfo",
    data: BytesLike
  ): Result;

  events: {
    "CouponsIssued(address,address,uint256,uint256)": EventFragment;
    "TokenWhitelisted(address,bool,bool,uint256)": EventFragment;
    "TokensWhiteListed(address[],bool[],uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CouponsIssued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenWhitelisted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensWhiteListed"): EventFragment;
}

export interface CouponsIssuedEventObject {
  user: string;
  token: string;
  amount: BigNumber;
  coupons: BigNumber;
}
export type CouponsIssuedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  CouponsIssuedEventObject
>;

export type CouponsIssuedEventFilter = TypedEventFilter<CouponsIssuedEvent>;

export interface TokenWhitelistedEventObject {
  token: string;
  enabled: boolean;
  burnable: boolean;
  teraCouponPerToken: BigNumber;
}
export type TokenWhitelistedEvent = TypedEvent<
  [string, boolean, boolean, BigNumber],
  TokenWhitelistedEventObject
>;

export type TokenWhitelistedEventFilter =
  TypedEventFilter<TokenWhitelistedEvent>;

export interface TokensWhiteListedEventObject {
  tokens: string[];
  burnable: boolean[];
  timestamp: BigNumber;
}
export type TokensWhiteListedEvent = TypedEvent<
  [string[], boolean[], BigNumber],
  TokensWhiteListedEventObject
>;

export type TokensWhiteListedEventFilter =
  TypedEventFilter<TokensWhiteListedEvent>;

export interface IIssuer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IIssuerInterface;

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
    currentPrice(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setCouponContract(
      newCouponAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setLimits(
      threshold_size: BigNumberish,
      days_multiple: BigNumberish,
      offset: BigNumberish,
      _targetedMintsPerWeek: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setTokenInfo(
      token: string,
      enabled: boolean,
      burnable: boolean,
      startingRate: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setTokensInfo(
      tokens: string[],
      enabled: boolean[],
      burnable: boolean[],
      startingRate: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  currentPrice(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  issue(
    inputToken: string,
    amount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setCouponContract(
    newCouponAddress: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setLimits(
    threshold_size: BigNumberish,
    days_multiple: BigNumberish,
    offset: BigNumberish,
    _targetedMintsPerWeek: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setTokenInfo(
    token: string,
    enabled: boolean,
    burnable: boolean,
    startingRate: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setTokensInfo(
    tokens: string[],
    enabled: boolean[],
    burnable: boolean[],
    startingRate: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    currentPrice(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setCouponContract(
      newCouponAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setLimits(
      threshold_size: BigNumberish,
      days_multiple: BigNumberish,
      offset: BigNumberish,
      _targetedMintsPerWeek: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenInfo(
      token: string,
      enabled: boolean,
      burnable: boolean,
      startingRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokensInfo(
      tokens: string[],
      enabled: boolean[],
      burnable: boolean[],
      startingRate: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CouponsIssued(address,address,uint256,uint256)"(
      user?: string | null,
      token?: string | null,
      amount?: null,
      coupons?: null
    ): CouponsIssuedEventFilter;
    CouponsIssued(
      user?: string | null,
      token?: string | null,
      amount?: null,
      coupons?: null
    ): CouponsIssuedEventFilter;

    "TokenWhitelisted(address,bool,bool,uint256)"(
      token?: null,
      enabled?: null,
      burnable?: null,
      teraCouponPerToken?: null
    ): TokenWhitelistedEventFilter;
    TokenWhitelisted(
      token?: null,
      enabled?: null,
      burnable?: null,
      teraCouponPerToken?: null
    ): TokenWhitelistedEventFilter;

    "TokensWhiteListed(address[],bool[],uint256)"(
      tokens?: null,
      burnable?: null,
      timestamp?: null
    ): TokensWhiteListedEventFilter;
    TokensWhiteListed(
      tokens?: null,
      burnable?: null,
      timestamp?: null
    ): TokensWhiteListedEventFilter;
  };

  estimateGas: {
    currentPrice(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setCouponContract(
      newCouponAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setLimits(
      threshold_size: BigNumberish,
      days_multiple: BigNumberish,
      offset: BigNumberish,
      _targetedMintsPerWeek: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setTokenInfo(
      token: string,
      enabled: boolean,
      burnable: boolean,
      startingRate: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setTokensInfo(
      tokens: string[],
      enabled: boolean[],
      burnable: boolean[],
      startingRate: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    currentPrice(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setCouponContract(
      newCouponAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setLimits(
      threshold_size: BigNumberish,
      days_multiple: BigNumberish,
      offset: BigNumberish,
      _targetedMintsPerWeek: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setTokenInfo(
      token: string,
      enabled: boolean,
      burnable: boolean,
      startingRate: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setTokensInfo(
      tokens: string[],
      enabled: boolean[],
      burnable: boolean[],
      startingRate: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
