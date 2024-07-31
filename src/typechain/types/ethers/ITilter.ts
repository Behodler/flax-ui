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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface ITilterInterface extends utils.Interface {
  functions: {
    "configure(address,address,address,address)": FunctionFragment;
    "issue(address,uint256,address)": FunctionFragment;
    "refValueOfTilt(uint256,bool)": FunctionFragment;
    "setEnabled(bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "configure"
      | "issue"
      | "refValueOfTilt"
      | "setEnabled"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "configure",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "issue",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "refValueOfTilt",
    values: [BigNumberish, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setEnabled", values: [boolean]): string;

  decodeFunctionResult(functionFragment: "configure", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refValueOfTilt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setEnabled", data: BytesLike): Result;

  events: {};
}

export interface ITilter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITilterInterface;

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
    configure(
      ref_token: string,
      flx: string,
      oracle: string,
      issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    refValueOfTilt(
      ref_amount: BigNumberish,
      preview: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        flax_new_balance: BigNumber;
        lpTokens_created: BigNumber;
      }
    >;

    setEnabled(
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  configure(
    ref_token: string,
    flx: string,
    oracle: string,
    issuer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  issue(
    inputToken: string,
    amount: BigNumberish,
    recipient: string,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  refValueOfTilt(
    ref_amount: BigNumberish,
    preview: boolean,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      flax_new_balance: BigNumber;
      lpTokens_created: BigNumber;
    }
  >;

  setEnabled(
    enabled: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    configure(
      ref_token: string,
      flx: string,
      oracle: string,
      issuer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    refValueOfTilt(
      ref_amount: BigNumberish,
      preview: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        flax_new_balance: BigNumber;
        lpTokens_created: BigNumber;
      }
    >;

    setEnabled(enabled: boolean, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    configure(
      ref_token: string,
      flx: string,
      oracle: string,
      issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    refValueOfTilt(
      ref_amount: BigNumberish,
      preview: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setEnabled(
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    configure(
      ref_token: string,
      flx: string,
      oracle: string,
      issuer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    issue(
      inputToken: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    refValueOfTilt(
      ref_amount: BigNumberish,
      preview: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setEnabled(
      enabled: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
