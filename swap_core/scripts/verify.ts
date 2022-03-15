const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    //Deployed contract address
    address: "0x0837F4E3e1bb69D0fF7472B23180F5033c4d3bCd",
    //Pass arguments as string and comma seprated values
    constructorArguments: [],
    //Path of your main contract.
    contract: "contracts/upgradability/OwnedUpgradeabilityProxy.sol:OwnedUpgradeabilityProxy",
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network rinkeby  scripts/verify.ts
