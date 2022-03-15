import { ethers } from "hardhat";
import {
  MasterChef__factory,
  MasterChef,
  EIFIToken__factory,
  EIFIToken,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
var BigNumber = require("big-number");
let masterChef: MasterChef;
let eifiToken: EIFIToken;
let owner: SignerWithAddress;
let signers: SignerWithAddress[];
const isInt = (n: any) => {
  return n % 1 === 0;
};
const convertWithDecimal = (value: any, decimal: any) => {
  if (value > 0) {
    if (isInt(value)) {
      value = parseInt(value);
      value = BigNumber(value).multiply(decimal);
    } else {
      value = value * decimal;
      value = toFixed(value);
      value = parseInt(value.toString().split(".")[0]);
      value = toFixed(value);
      value = BigNumber(value);
    }
    return value.toString();
  } else {
    return 0;
  }
};

const toFixed = (x: any) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};
async function main() {
  signers = await ethers.getSigners();
  owner = signers[0];
  eifiToken = await new EIFIToken__factory(owner).deploy();
  masterChef = await new MasterChef__factory(owner).deploy(
    eifiToken.address,
    16425372,
    convertWithDecimal(100, 10 ** 18)
  );
  await eifiToken.connect(owner).transferOwnership(masterChef.address);
  console.log(`EIFI Token Contract deployed at : ${eifiToken.address} `);
  console.log(`MasterChef Contract deployed at : ${masterChef.address} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network rinkeby  scripts/deploy.ts
