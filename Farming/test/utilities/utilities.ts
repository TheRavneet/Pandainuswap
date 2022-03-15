import { ethers } from "hardhat";

const abi = require("ethereumjs-abi");
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;

export async function mineBlocks(
  provider: typeof ethers.provider,
  count: number
): Promise<void> {
  for (let i = 1; i < count; i++) {
    await provider.send("evm_mine", []);
  }
}
