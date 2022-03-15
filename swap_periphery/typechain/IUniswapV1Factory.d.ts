/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IUniswapV1FactoryInterface extends ethers.utils.Interface {
  functions: {
    "feeValue()": FunctionFragment;
    "getExchange(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "feeValue", values?: undefined): string;
  encodeFunctionData(functionFragment: "getExchange", values: [string]): string;

  decodeFunctionResult(functionFragment: "feeValue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getExchange",
    data: BytesLike
  ): Result;

  events: {};
}

export class IUniswapV1Factory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IUniswapV1FactoryInterface;

  functions: {
    feeValue(overrides?: CallOverrides): Promise<[number]>;

    "feeValue()"(overrides?: CallOverrides): Promise<[number]>;

    getExchange(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    "getExchange(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  feeValue(overrides?: CallOverrides): Promise<number>;

  "feeValue()"(overrides?: CallOverrides): Promise<number>;

  getExchange(arg0: string, overrides?: CallOverrides): Promise<string>;

  "getExchange(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    feeValue(overrides?: CallOverrides): Promise<number>;

    "feeValue()"(overrides?: CallOverrides): Promise<number>;

    getExchange(arg0: string, overrides?: CallOverrides): Promise<string>;

    "getExchange(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    feeValue(overrides?: CallOverrides): Promise<BigNumber>;

    "feeValue()"(overrides?: CallOverrides): Promise<BigNumber>;

    getExchange(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getExchange(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    feeValue(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "feeValue()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getExchange(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getExchange(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
