import { ethers } from "hardhat";
import {
  EiFiRouter__factory,
  EiFiRouter,
  WETH__factory,
  WETH,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
var BigNumber = require("big-number");
let router: EiFiRouter;
let _WETH: WETH;
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
  // _WETH = await new WETH__factory(owner).deploy();
  router = await new EiFiRouter__factory(owner).deploy(
    "0xb9692b79B54417aA59c66B34A97431547b6f1D5d",
    "0x9746E0C3e1c7c5e9A30030b1A9eD348f2ef323dc"
  );
  // console.log(`WETH Contract deployed at : ${_WETH.address} `);
  console.log(`Router Contract deployed at : ${router.address} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network rinkeby  scripts/deploy.ts
