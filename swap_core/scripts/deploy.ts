import { ethers } from "hardhat";
import {
  MigrateLP__factory,
  MigrateLP,
  EiFiFactory__factory,
  EiFiFactory,
  CalHash__factory,
  CalHash,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
var BigNumber = require("big-number");
let factory: EiFiFactory;
let migrateLp: MigrateLP;
let calHash: CalHash;
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
  migrateLp = await new MigrateLP__factory(owner).deploy(
    "0xb9692b79B54417aA59c66B34A97431547b6f1D5d",
    "0x849ef6b75fdB89D7dBc6aA8e9D5a78f992A2C37B"
  );
  // factory = await new EiFiFactory__factory(owner).deploy(owner.address, "2000");
  // calHash = await new CalHash__factory(owner).deploy();
  // calHash = await new CalHash__factory(owner).attach(
  //   "0x5c166546DAA5579cdB26BC338A32C6F72848A207"
  // );

  // migrateLp = await new MigrateLP__factory(owner).attach("0xD8B4de02813261C7E0da2bAbf5576D40a2f6792E");
  // await migrateLp.migrate("0x6432a44c8c8db368A7c5ab8Acc82A89b663D5a79");
  // let hash = await calHash.getInitHash();
  // console.log(`factory Contract deployed at : ${factory.address} `);
  // console.log(`calHash Contract deployed at : ${calHash.address} `);
  // console.log(`hash Contract deployed at : ${hash} `);
  console.log(`migrateLp Contract deployed at : ${migrateLp.address} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network rinkeby  scripts/deploy.ts
