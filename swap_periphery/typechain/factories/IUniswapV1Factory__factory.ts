/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IUniswapV1Factory } from "../IUniswapV1Factory";

export class IUniswapV1Factory__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUniswapV1Factory {
    return new Contract(address, _abi, signerOrProvider) as IUniswapV1Factory;
  }
}

const _abi = [
  {
    inputs: [],
    name: "feeValue",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getExchange",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
