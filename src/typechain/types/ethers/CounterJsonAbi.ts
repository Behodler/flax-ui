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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface CounterJsonAbiInterface extends utils.Interface {
  functions: {
    "increment()": FunctionFragment;
    "number()": FunctionFragment;
    "setNumber(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "increment" | "number" | "setNumber"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "increment", values?: undefined): string;
  encodeFunctionData(functionFragment: "number", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setNumber",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "increment", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "number", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setNumber", data: BytesLike): Result;

  events: {};
}

export interface CounterJsonAbi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CounterJsonAbiInterface;

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
    increment(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    number(overrides?: CallOverrides): Promise<[BigNumber]>;

    setNumber(
      newNumber: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  increment(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  number(overrides?: CallOverrides): Promise<BigNumber>;

  setNumber(
    newNumber: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    increment(overrides?: CallOverrides): Promise<void>;

    number(overrides?: CallOverrides): Promise<BigNumber>;

    setNumber(
      newNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    increment(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    number(overrides?: CallOverrides): Promise<BigNumber>;

    setNumber(
      newNumber: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    increment(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    number(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setNumber(
      newNumber: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
