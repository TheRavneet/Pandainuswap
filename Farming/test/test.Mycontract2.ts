import {
  OwnedUpgradeabilityProxy__factory,
  OwnedUpgradeabilityProxy,
  CreatorCoin__factory,
  CreatorCoin,
  STO__factory,
  STO,
  USDT__factory,
  USDT,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import { mineBlocks } from "./utilities/utilities";
import { expect } from "chai";
import { BigIntStats } from "fs";
// import { BigNumber } from "ethers";
var BigNumber = require("big-number");
const nullAddress = "0x0000000000000000000000000000000000000000";

describe("MyContract", async () => {
  let impl: STO;
  let usdtImpl: USDT;
  let proxy: STO;
  let mainUpgrade: OwnedUpgradeabilityProxy;
  let creatorImpl: CreatorCoin;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
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

  const _calculateRequiredUsdtTokenAmount = async (
    id: any,
    offerId: any,
    tokenAmount: any
  ) => {
    let currentOffer = await proxy.idToOfferMapping(id, offerId);
    let requiredUsdtTokenAmount =
      (tokenAmount * currentOffer.usdtTokenAmount.toNumber()) /
      currentOffer.tokenAmount.toNumber();

    return requiredUsdtTokenAmount;
  };

  const _calculateIncentiveAmount = async (
    id: any,
    claimCounter: any,
    userAddress: any
  ) => {
    let propertyTokenBalance = await creatorImpl.balanceOf(userAddress, id);
    let currentIncentive = await proxy.propertyIncentiveMapping(
      id,
      claimCounter
    );
    let incentiveAmount = currentIncentive.tokenIncentiveAmount;
    let propertyMapping = await proxy.propertyIncentiveMapping(
      id,
      claimCounter
    );
    let propertyTokensSold = propertyMapping.tokenSoldAtTime;

    let result =
      (propertyTokenBalance.toNumber() * incentiveAmount.toNumber()) /
      propertyTokensSold.toNumber();

    return parseInt(result.toString());
  };

  const _getPropertyTokenAmount = async (_id: any, _usdtTokenAmount: any) => {
    let currentProperty = await proxy.propertyMapping(_id);

    let currentPropertyValue = currentProperty.propertyValue;
    // require(currentPropertyValue != 0, "Property not listed yet.");

    // do the calculations here
    let unitCurrencyPrice = 100043275;
    let usdtDecimals = await usdtImpl.decimals();
    // uint256 unitCurrencyPrice =   (uint256)( oracleInterface(oracleWrapperAddress).latestAnswer());
    let usdtAmountInDollar =
      (_usdtTokenAmount * unitCurrencyPrice) / 10 ** usdtDecimals; // $ in 10**8

    return (
      (usdtAmountInDollar * currentProperty.totalSupply.toNumber()) /
      currentPropertyValue.toNumber()
    );
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

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    usdtImpl = await new USDT__factory(owner).deploy();
    creatorImpl = await new CreatorCoin__factory(owner).deploy(
      "https://ipfs.io/ipfs/"
    );
    impl = await new STO__factory(owner).deploy();
    mainUpgrade = await new OwnedUpgradeabilityProxy__factory(owner).deploy();
    proxy = await new STO__factory(owner).attach(mainUpgrade.address);
    // proxy = await new OwnedUpgradeabilityProxy__factory(owner).attach("0x014f6898e58ee81937A1bFF057e7ae4a981968B4");
    const initializeData = await impl.interface.encodeFunctionData(
      "initialize",
      [
        owner.address,
        creatorImpl.address,
        usdtImpl.address,
        "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
      ]
    );
    await mainUpgrade.upgradeToAndCall(impl.address, initializeData);
    // await proxy.upgradeTo(impl.address);

    await creatorImpl.transferOwnership(mainUpgrade.address);
    // await proxy.updateUSDTContractAddress(usdtImpl.address);
  });

  describe("contract Deployed", async () => {
    it("WhiteList user can only list property", async function () {
      let user = signers[1];
      await expect(
        proxy.create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        )
      ).to.be.revertedWith("Not whitelisted user.");
    });

    it("Create Property can be done only by owner", async function () {
      let user = signers[1];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await expect(
        proxy
          .connect(user)
          .create(
            "1",
            100000000000,
            100000000000,
            50000,
            user.address,
            "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("verify the Created Property", async function () {
      let user = signers[1];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      let initialBalance = await creatorImpl.balanceOf(user.address, 1);
      let tokenValue = 100000000000;
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // verify the balance difference
      let finalBalance = await creatorImpl.balanceOf(user.address, 1);
      let difference = finalBalance.toNumber() - initialBalance.toNumber();
      expect(difference).to.be.eq(tokenValue);

      // check the values of property info
      let listedPropertyInfo = await proxy.propertyMapping(1);

      await expect(listedPropertyInfo.propertyValue.toNumber()).to.be.eq(
        100000000000
      );
      await expect(listedPropertyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      await expect(
        listedPropertyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(50000000000);
      await expect(
        listedPropertyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(50000000000);
      await expect(listedPropertyInfo.accreditedTokensSold.toNumber()).to.be.eq(
        0
      );
      await expect(
        listedPropertyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyInfo.claimCounter.toNumber()).to.be.eq(0);
      await expect(listedPropertyInfo.propertyOwner).to.be.eq(user.address);
    });

    it("Can't list the same property again", async function () {
      let user = signers[1];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await expect(
        proxy
          .connect(owner)
          .create(
            "1",
            100000000000,
            100000000000,
            50000,
            user.address,
            "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
          )
      ).to.be.revertedWith("Property already exists.");
    });

    it("Buy Property with accredited user", async function () {
      // user is property lister
      let user = signers[1];
      // userBuyer is accredited user trying to buy the property
      let userBuyer = signers[2];

      // funding userBuyer with some usdt so that it can buy some property tokens
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);

      // whitelisting property owner so that property tokens can be minted for it
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      // giving role of accredited user for userBuyer
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // initial balance of the userBuyer
      let initialBalance = await creatorImpl.balanceOf(userBuyer.address, 1);
      let initialUsdtBalance = await usdtImpl.balanceOf(userBuyer.address);

      // property Info structure before buying

      // check the values of property info
      let listedPropertyBeforeBuyInfo = await proxy.propertyMapping(1);

      await expect(
        listedPropertyBeforeBuyInfo.propertyValue.toNumber()
      ).to.be.eq(100000000000);
      await expect(listedPropertyBeforeBuyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      await expect(
        listedPropertyBeforeBuyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      await expect(
        listedPropertyBeforeBuyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);
      await expect(
        listedPropertyBeforeBuyInfo.accreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.claimCounter.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyBeforeBuyInfo.propertyOwner).to.be.eq(
        user.address
      );

      // buying the property
      await proxy.connect(userBuyer).buy(1, 10000000);
      let calculateValue = await proxy.calculateTokens(1, 10000000);
      let finalBalance = await creatorImpl.balanceOf(userBuyer.address, 1);
      let finalUsdtBalance = await usdtImpl.balanceOf(userBuyer.address);

      let difference = finalBalance.toNumber() - initialBalance.toNumber();

      let usdtDifference =
        initialUsdtBalance.toNumber() - finalUsdtBalance.toNumber();

      expect(difference).to.be.eq(10000000);
      expect(usdtDifference).to.be.eq(calculateValue);

      // check the values of property info
      let listedPropertyAfterBuyInfo = await proxy.propertyMapping(1);
      // let calculatedTokenToBeSold = await proxy.calculateTokens(1, 10000000);

      await expect(
        listedPropertyAfterBuyInfo.propertyValue.toNumber()
      ).to.be.eq(100000000000);
      await expect(listedPropertyAfterBuyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      // token to be sold amount will decrease as tokens are bought
      await expect(
        listedPropertyAfterBuyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      // tokens actually sold amount should increase by the same amount as tokens are bought
      await expect(
        listedPropertyAfterBuyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);
      await expect(
        listedPropertyAfterBuyInfo.accreditedTokensSold.toNumber()
      ).to.be.eq(10000000);
      await expect(
        listedPropertyAfterBuyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyAfterBuyInfo.claimCounter.toNumber()).to.be.eq(
        0
      );
      await expect(listedPropertyAfterBuyInfo.propertyOwner).to.be.eq(
        user.address
      );
    });

    it("Accredited User cannot buy Property tokens greater than the token supply", async function () {
      // user is property lister
      let user = signers[1];
      // userBuyer is accredited user trying to buy the property
      let userBuyer = signers[2];

      // funding userBuyer with some usdt so that it can buy some property tokens
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);

      // whitelisting property owner so that property tokens can be minted for it
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      // giving role of accredited user for userBuyer
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await expect(
        proxy.connect(userBuyer).buy(1, 1000000000000)
      ).to.be.revertedWith("Amount not available");
    });

    it("Buy Property with non-accredited user", async function () {
      // user is property lister
      let user = signers[1];
      // userBuyer is accredited user trying to buy the property
      let userBuyer = signers[2];

      // funding userBuyer with some usdt so that it can buy some property tokens
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);

      // whitelisting property owner so that property tokens can be minted for it
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      // giving role of non-accredited user for userBuyer
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 3, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // initial balance of the userBuyer
      let initialBalance = await creatorImpl.balanceOf(userBuyer.address, 1);
      let initialUsdtBalance = await usdtImpl.balanceOf(userBuyer.address);

      // property Info structure before buying

      // check the values of property info
      let listedPropertyBeforeBuyInfo = await proxy.propertyMapping(1);

      await expect(
        listedPropertyBeforeBuyInfo.propertyValue.toNumber()
      ).to.be.eq(100000000000);
      await expect(listedPropertyBeforeBuyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      await expect(
        listedPropertyBeforeBuyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      await expect(
        listedPropertyBeforeBuyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);
      await expect(
        listedPropertyBeforeBuyInfo.accreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.claimCounter.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyBeforeBuyInfo.propertyOwner).to.be.eq(
        user.address
      );

      // buying the property
      await proxy.connect(userBuyer).buy(1, 10000000);
      let calculateValue = await proxy.calculateTokens(1, 10000000);
      let finalBalance = await creatorImpl.balanceOf(userBuyer.address, 1);
      let finalUsdtBalance = await usdtImpl.balanceOf(userBuyer.address);

      let difference = finalBalance.toNumber() - initialBalance.toNumber();
      let usdtDifference =
        initialUsdtBalance.toNumber() - finalUsdtBalance.toNumber();

      expect(difference).to.be.eq(10000000);
      expect(usdtDifference).to.be.eq(calculateValue);

      // check the values of property info
      let listedPropertyAfterBuyInfo = await proxy.propertyMapping(1);
      let calculatedTokenToBeSold = await proxy.calculateTokens(1, 10000000);

      await expect(
        listedPropertyAfterBuyInfo.propertyValue.toNumber()
      ).to.be.eq(100000000000);
      await expect(listedPropertyAfterBuyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      // token to be sold amount will decrease as tokens are bought
      await expect(
        listedPropertyAfterBuyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      // tokens actually sold amount should increase by the same amount as tokens are bought
      await expect(
        listedPropertyAfterBuyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);
      await expect(
        listedPropertyAfterBuyInfo.accreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyAfterBuyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(10000000);
      await expect(listedPropertyAfterBuyInfo.claimCounter.toNumber()).to.be.eq(
        0
      );
      await expect(listedPropertyAfterBuyInfo.propertyOwner).to.be.eq(
        user.address
      );
    });

    it("Non-accredited user cannot buy property tokens greater than total supply", async function () {
      // user is property lister
      let user = signers[1];
      // userBuyer is accredited user trying to buy the property
      let userBuyer = signers[2];

      // funding userBuyer with some usdt so that it can buy some property tokens
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);

      // whitelisting property owner so that property tokens can be minted for it
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      // giving role of non-accredited user for userBuyer
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 3, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // initial balance of the userBuyer
      let initialBalance = await creatorImpl.balanceOf(userBuyer.address, 1);

      // property Info structure before buying

      // check the values of property info
      let listedPropertyBeforeBuyInfo = await proxy.propertyMapping(1);

      await expect(
        listedPropertyBeforeBuyInfo.propertyValue.toNumber()
      ).to.be.eq(100000000000);
      await expect(listedPropertyBeforeBuyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      await expect(
        listedPropertyBeforeBuyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      await expect(
        listedPropertyBeforeBuyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);
      await expect(
        listedPropertyBeforeBuyInfo.accreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(
        listedPropertyBeforeBuyInfo.claimCounter.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyBeforeBuyInfo.propertyOwner).to.be.eq(
        user.address
      );

      // buying the property
      await expect(
        proxy.connect(userBuyer).buy(1, 200000000000)
      ).to.be.revertedWith("Amount not available");
    });

    it("Non-accredited user cannot buy property tokens greater than what is assigned for non-accredited users", async function () {
      // user is property lister
      let user = signers[1];
      // userBuyer is accredited user trying to buy the property
      let userBuyer = signers[2];

      // funding userBuyer with some usdt so that it can buy some property tokens
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);

      // whitelisting property owner so that property tokens can be minted for it
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      // giving role of non-accredited user for userBuyer
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 3, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await expect(
        proxy.connect(userBuyer).buy(1, 60000000000)
      ).to.be.revertedWith("Amount not available");
    });

    it("Buy Property with 3 users , 2 accredited users , 1 non-accredited users , positive case", async () => {
      let user1 = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      let user4 = signers[4];

      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user4.address, 1000000000);

      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user4).approve(proxy.address, 100000000000);

      await proxy.connect(owner).whitelistAddress(user1.address, 2, true);
      // assigning credited user role to these users
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);
      // assigning non-credited user role to these users
      await proxy.connect(owner).whitelistAddress(user4.address, 3, true);

      // creating property
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          60000,
          user1.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user1).setApprovalForAll(proxy.address, true);
      let user2BeforeBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user2UsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let user3BeforeBalance = await creatorImpl.balanceOf(user3.address, 1);
      let user3UsdtBeforeBalance = await usdtImpl.balanceOf(user3.address);
      let user4BeforeBalance = await creatorImpl.balanceOf(user4.address, 1);
      let user4UsdtBeforeBalance = await usdtImpl.balanceOf(user4.address);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);
      await proxy.connect(user3).buy(1, 20000000);
      await proxy.connect(user4).buy(1, 30000000);

      let calculateValue1 = await proxy.calculateTokens(1, 10000000);
      let calculateValue2 = await proxy.calculateTokens(1, 20000000);
      let calculateValue3 = await proxy.calculateTokens(1, 30000000);

      let user2AfterBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user2UsdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      let user3AfterBalance = await creatorImpl.balanceOf(user3.address, 1);
      let user3UsdtAfterBalance = await usdtImpl.balanceOf(user3.address);
      let user4AfterBalance = await creatorImpl.balanceOf(user4.address, 1);
      let user4UsdtAfterBalance = await usdtImpl.balanceOf(user4.address);

      let difference1 =
        user2AfterBalance.toNumber() - user2BeforeBalance.toNumber();
      let usdtDifference1 =
        user2UsdtBeforeBalance.toNumber() - user2UsdtAfterBalance.toNumber();

      let difference2 =
        user3AfterBalance.toNumber() - user3BeforeBalance.toNumber();
      let usdtDifference2 =
        user3UsdtBeforeBalance.toNumber() - user3UsdtAfterBalance.toNumber();

      let difference3 =
        user4AfterBalance.toNumber() - user4BeforeBalance.toNumber();
      let usdtDifference3 =
        user4UsdtBeforeBalance.toNumber() - user4UsdtAfterBalance.toNumber();

      expect(difference1).to.be.eq(10000000);
      expect(difference2).to.be.eq(20000000);
      expect(difference3).to.be.eq(30000000);

      expect(usdtDifference1).to.be.eq(calculateValue1);
      expect(usdtDifference2).to.be.eq(calculateValue2);
      expect(usdtDifference3).to.be.eq(calculateValue3);

      // check the values of property info
      let listedPropertyInfo = await proxy.propertyMapping(1);
      let calculatedTokenToBeSold = await proxy.calculateTokens(1, 60000000);

      await expect(listedPropertyInfo.propertyValue.toNumber()).to.be.eq(
        100000000000
      );
      await expect(listedPropertyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      await expect(
        listedPropertyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(60000000000);
      await expect(
        listedPropertyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(40000000000);

      // tokens actually sold amount should increase by the same amount as tokens are bought
      await expect(
        listedPropertyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(30000000);
      await expect(listedPropertyInfo.accreditedTokensSold.toNumber()).to.be.eq(
        30000000
      );

      await expect(listedPropertyInfo.claimCounter.toNumber()).to.be.eq(0);
      await expect(listedPropertyInfo.propertyOwner).to.be.eq(user1.address);
    });

    it("Buy Property with 3 users , 2 accredited users , 1 non-accredited users , negative case , accredited users buy more than min accredited token amount mentiones", async () => {
      let user1 = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      let user4 = signers[4];

      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user4.address, 1000000000);

      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user4).approve(proxy.address, 100000000000);

      await proxy.connect(owner).whitelistAddress(user1.address, 2, true);
      // assigning credited user role to these users
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);
      // assigning non-credited user role to these users
      await proxy.connect(owner).whitelistAddress(user4.address, 3, true);

      // creating property
      await proxy
        .connect(owner)
        .create(
          "1",
          1000000000,
          1000000000,
          60000,
          user1.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user1).setApprovalForAll(proxy.address, true);
      let user2BeforeBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user2UsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let user3BeforeBalance = await creatorImpl.balanceOf(user3.address, 1);
      let user3UsdtBeforeBalance = await usdtImpl.balanceOf(user3.address);

      let calculateValue1 = await proxy.calculateTokens(1, 400000000);
      let calculateValue2 = await proxy.calculateTokens(1, 300000000);

      // buying the property
      await proxy.connect(user2).buy(1, 400000000);

      await proxy.connect(user3).buy(1, 300000000);

      let user2AfterBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user2usdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      let user3AfterBalance = await creatorImpl.balanceOf(user3.address, 1);
      let user3usdtAfterBalance = await usdtImpl.balanceOf(user3.address);

      let difference1 =
        user2AfterBalance.toNumber() - user2BeforeBalance.toNumber();

      let usdtDifference1 =
        user2UsdtBeforeBalance.toNumber() - user2usdtAfterBalance.toNumber();

      let difference2 =
        user3AfterBalance.toNumber() - user3BeforeBalance.toNumber();

      let usdtDifference2 =
        user3UsdtBeforeBalance.toNumber() - user3usdtAfterBalance.toNumber();

      expect(difference1).to.be.eq(400000000);
      expect(difference2).to.be.eq(300000000);
      expect(usdtDifference1).to.be.eq(calculateValue1);
      expect(usdtDifference2).to.be.eq(calculateValue2);

      let listedPropertyInfo = await proxy.propertyMapping(1);

      await expect(listedPropertyInfo.propertyValue.toNumber()).to.be.eq(
        1000000000
      );
      await expect(listedPropertyInfo.totalSupply.toNumber()).to.be.eq(
        1000000000
      );
      await expect(
        listedPropertyInfo.minAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(600000000);
      await expect(
        listedPropertyInfo.maxNonAccreditedTokensToBeSold.toNumber()
      ).to.be.eq(400000000);

      // tokens actually sold amount should increase by the same amount as tokens are bought
      await expect(
        listedPropertyInfo.nonAccreditedTokensSold.toNumber()
      ).to.be.eq(0);
      await expect(listedPropertyInfo.accreditedTokensSold.toNumber()).to.be.eq(
        700000000
      );

      await expect(listedPropertyInfo.claimCounter.toNumber()).to.be.eq(0);
      await expect(listedPropertyInfo.propertyOwner).to.be.eq(user1.address);

      await expect(proxy.connect(user4).buy(1, 400000000)).to.be.revertedWith(
        "Amount not available"
      );
    });
  });

  describe("Listing incentives", async () => {
    it("Only property owners can list incentives", async function () {
      let user = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      // whitelist user and create a property
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);

      // create a property
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // fund the non-owner user
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);

      // approve the contract to spend user2 usdt
      await usdtImpl.connect(user2).approve(proxy.address, 10000000000000);

      // a user who doesnot own property tries to list incentive
      await expect(
        proxy.connect(user2).generateIncentive(1, 1000000000)
      ).to.be.revertedWith("invalid access");
    });

    it("should not allow to list incentive with invalid id", async function () {
      let user = signers[1];
      await expect(
        proxy.connect(owner).generateIncentive(1, 1000000000)
      ).to.be.revertedWith("Invalid id");
    });

    it("should not allow to list incentive with 0 usdt amount", async function () {
      let user = signers[1];
      await expect(
        proxy.connect(owner).generateIncentive(0, 0)
      ).to.be.revertedWith("Invalid usdt amount");
    });

    it("Owner should not be able to list incentive with insufficient usdt balance ", async () => {
      let user = signers[1];
      // create the property
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await expect(
        proxy
          .connect(owner)
          .create(
            "1",
            100000000000,
            100000000000,
            50000,
            user.address,
            "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
          )
      );

      // get the owner usdt balance
      let ownerUsdtBalance = await usdtImpl.balanceOf(owner.address);
      // owner transfers all his balance to user address so that it gets 0 balance
      await usdtImpl.transfer(user.address, ownerUsdtBalance.toNumber());

      // list the incentive
      await expect(
        proxy.connect(owner).generateIncentive(1, 1000000000)
      ).to.be.revertedWith("Insufficient usdt");
    });

    it("Owner should not be able to list incentive successfully without approving STO contract to spend its usdt", async () => {
      let user = signers[1];
      // create the property
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await expect(
        proxy
          .connect(owner)
          .create(
            "1",
            100000000000,
            100000000000,
            50000,
            user.address,
            "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
          )
      );

      // get the owner usdt balance
      let ownerUsdtBalance = await usdtImpl.balanceOf(owner.address);

      // list the incentive
      await expect(
        proxy.connect(owner).generateIncentive(1, 1000000000)
      ).to.be.revertedWith("Usdt approval needed");
    });

    it("Owner should  be able to list incentive successfully with the correct parameters ", async () => {
      let user = signers[1];
      // create the property
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await expect(
        proxy
          .connect(owner)
          .create(
            "1",
            100000000000,
            100000000000,
            50000,
            user.address,
            "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
          )
      );

      // fund the property owner with usdt
      await usdtImpl.transfer(user.address, 1000000000000);

      // get the owner usdt balance
      let ownerUsdtBeforeBalance = await usdtImpl.balanceOf(user.address);
      let contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);

      // approve STO contract to spend the owners usdt
      await usdtImpl.connect(user).approve(proxy.address, 100000000000);

      // list the incentive
      await proxy.connect(user).generateIncentive(1, 1000000000);

      // check balances of contract and owner again
      let ownerUsdtAfterBalance = await usdtImpl.balanceOf(user.address);
      let contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);

      let ownerBalanceDifference =
        ownerUsdtBeforeBalance.toNumber() - ownerUsdtAfterBalance.toNumber();

      let contractBalanceDifference =
        contractUsdtAfterBalance.toNumber() -
        contractUsdtBeforeBalance.toNumber();

      // owner usdt balance should have been decreased and contract usdt balance would have been increased
      expect(ownerBalanceDifference).to.be.eq(1000000000);
      expect(contractBalanceDifference).to.be.eq(1000000000);

      // verify the state variables
      let currentIncentive = await proxy.propertyIncentiveMapping(1, 1);
      await expect(currentIncentive.tokenIncentiveAmount).to.be.eq(1000000000);
    });
  });

  // test cases for claiming incentives
  describe.only("Claiming incentives", async () => {
    it.only("User should not be able to claim when there are no incentives", async () => {
      let user = signers[1];
      let userBuyer = signers[2];
      // list  property
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(userBuyer).buy(1, 10000000);

      // claim incentives
      await expect(
        proxy.connect(userBuyer).claimIncentive(1)
      ).to.be.revertedWith("No Incentives to claim");
    });

    it.only("User who has not bought the property should not be able to claim incentives", async () => {
      let user = signers[1];
      let userBuyer = signers[2];
      let user3 = signers[3];
      // list  property
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(userBuyer).buy(1, 10000000);

      // list incentive
      // fund the incentive creator
      await usdtImpl.transfer(user.address, 1000000000);
      // approve STO contract to spend the owners usdt
      await usdtImpl.connect(user).approve(proxy.address, 100000000000);

      // list the incentive
      await proxy.connect(user).generateIncentive(1, 1000000000);

      // claim incentives
      await expect(proxy.connect(user3).claimIncentive(1)).to.be.revertedWith(
        "Invalid claim"
      );
    });

    it.only("User who has  bought the property should  be able to claim incentives , user should only be able to claim an incentive once", async () => {
      let user = signers[1];
      let userBuyer = signers[2];

      // list  property
      await usdtImpl.connect(owner).transfer(userBuyer.address, 1000000000);
      await usdtImpl.connect(userBuyer).approve(proxy.address, 100000000000);
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(userBuyer.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(userBuyer).buy(1, 10000000);

      // list incentive
      // fund incentive generator address i.e property owner
      await usdtImpl.transfer(user.address, 1000000000);
      // approve STO contract to spend the owners usdt
      await usdtImpl.connect(user).approve(proxy.address, 10000000000);

      // list the incentive
      await proxy.connect(user).generateIncentive(1, 1000000000);

      let userBuyerBeforeBalance = await usdtImpl.balanceOf(userBuyer.address);
      let expectedIncentiveAmount = await _calculateIncentiveAmount(
        1,
        1,
        userBuyer.address
      );
      let userIncentiveBefore = await proxy.userIncentiveMapping(
        1,
        userBuyer.address
      );
      console.log(
        "**@ userIncentive before is , ",
        userIncentiveBefore.toString()
      );

      console.log(
        "**@ expectedIncentiveAmount before is , ",
        expectedIncentiveAmount.toString()
      );

      // claim incentives
      let tx = await proxy.connect(userBuyer).claimIncentive(1);

      let userIncentiveAfter = await proxy.userIncentiveMapping(
        1,
        userBuyer.address
      );

      let userBuyerAfterBalance = await usdtImpl.balanceOf(userBuyer.address);

      let difference =
        userBuyerBeforeBalance.toNumber() - userBuyerAfterBalance.toNumber();

      console.log(
        "**@ userBuyerBeforeBalance is , ",
        userBuyerBeforeBalance.toNumber()
      );
      console.log(
        "**@ userBuyerAfterBalance is , ",
        userBuyerAfterBalance.toNumber()
      );
      console.log("**@ difference is , ", difference);

      expect(difference).to.be.eq(expectedIncentiveAmount);
      expect(userIncentiveAfter.claimedCounter.toNumber()).to.be.eq(
        userIncentiveBefore.claimedCounter.toNumber() + 1
      );
      expect(userIncentiveAfter.timestamp.toNumber()).to.be.eq(
        userIncentiveBefore.timestamp.toNumber()
      );

      await expect(
        proxy.connect(userBuyer).claimIncentive(1)
      ).to.be.revertedWith("No Incentives to claim");
    });

    // claim incentive with multiple users
    it("should handle listing and claiming functionality with 3 users", async () => {
      let user1 = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      let user4 = signers[4];

      // FUNDING ADDRESSES WITH USDT SO THAT THEY CAN BUY PROPERTY TOKENS
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(owner).transfer(user4.address, 1000000000);

      // addresses give sto contract approval to spend their usdt tokens
      await usdtImpl.connect(owner).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);
      await usdtImpl.connect(user4).approve(proxy.address, 100000000000);

      // owner whitelists the property lister
      await proxy.connect(owner).whitelistAddress(user1.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user4.address, 2, true);

      // owner creates the property
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user1.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      // lister approving the sto contract to spend its property tokens
      await creatorImpl.connect(user1).setApprovalForAll(proxy.address, true);

      // usdt before balance of user 2 and 3
      let user2BeforeBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user3BeforeBalance = await creatorImpl.balanceOf(user3.address, 1);

      // user 2 and 3  buying the property
      await proxy.connect(user2).buy(1, 10000000);
      await proxy.connect(user3).buy(1, 20000000);

      // calculating how much property tokens will user 2 and 3 get
      let calculateValue1 = await _getPropertyTokenAmount(1, 10000000);
      let calculateValue2 = await _getPropertyTokenAmount(1, 20000000);

      // usdt balance of user 2 and 3 afer buying the property
      let user2AfterBalance = await creatorImpl.balanceOf(user2.address, 1);
      let user3AfterBalance = await creatorImpl.balanceOf(user3.address, 1);

      // difference in initial and final usdt balance of user 2 and 3
      let difference1 =
        user2AfterBalance.toNumber() - user2BeforeBalance.toNumber();
      let difference2 =
        user3AfterBalance.toNumber() - user3BeforeBalance.toNumber();

      // comparing differences
      expect(difference1).to.be.eq(calculateValue1);
      expect(difference2).to.be.eq(calculateValue2);

      // check the values of property info
      let listedPropertyInfo = await proxy.propertyMapping(1);
      let calculatedTokenToBeSold = await _getPropertyTokenAmount(1, 30000000);

      await expect(listedPropertyInfo.propertyValue.toNumber()).to.be.eq(
        100000000000
      );
      await expect(listedPropertyInfo.totalSupply.toNumber()).to.be.eq(
        100000000000
      );
      // token to be sold amount will decrease as tokens are bought
      // await expect(listedPropertyInfo.tokenToBeSold.toNumber()).to.be.eq(50000000000-calculatedTokenToBeSold.toNumber());
      // tokens actually sold amount should increase by the same amount as tokens are bought
      // await expect(listedPropertyInfo.tokenActuallySold.toNumber()).to.be.eq(calculatedTokenToBeSold.toNumber());
      await expect(listedPropertyInfo.claimCounter.toNumber()).to.be.eq(0);
      await expect(listedPropertyInfo.propertyOwner).to.be.eq(user1.address);
      // two users have bought the property

      let contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      // lister creating the incentive
      await proxy.connect(owner).generateIncentive(1, 1000000000);
      let contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      let contractDifference =
        contractUsdtAfterBalance.toNumber() -
        contractUsdtBeforeBalance.toNumber();
      // checking that contract get usdt tokens when owner generates incentives
      await expect(contractDifference).to.be.eq(1000000000);

      // user  2 claims incentive  , verify properties
      let userIncentiveBefore = await proxy.userIncentiveMapping(
        1,
        user2.address
      );
      let userBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        1,
        user2.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await proxy.connect(user2).claimIncentive(1);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      // checking change in contract usdt balance after user 2 claims incentives
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      let userIncentiveAfter = await proxy.userIncentiveMapping(
        1,
        user2.address
      );
      let userAfterBalance = await usdtImpl.balanceOf(user2.address);
      let difference =
        userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      await expect(difference).to.be.eq(userCalculatedIncentive);

      // user 3 claims incentive , verify properties
      userIncentiveBefore = await proxy.userIncentiveMapping(1, user3.address);
      userBeforeBalance = await usdtImpl.balanceOf(user3.address);
      userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        1,
        user3.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await proxy.connect(user3).claimIncentive(1);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      // checking change in contract usdt balance after user 2 claims incentives
      await expect(contractDifference).to.be.eq(contractDifference);

      userIncentiveAfter = await proxy.userIncentiveMapping(1, user3.address);
      userAfterBalance = await usdtImpl.balanceOf(user3.address);
      difference = userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      await expect(difference).to.be.eq(userCalculatedIncentive);

      // user 3 tries to claim , should give error
      userIncentiveBefore = await proxy.userIncentiveMapping(1, user4.address);
      userBeforeBalance = await usdtImpl.balanceOf(user4.address);
      userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        1,
        user4.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await expect(proxy.connect(user4).claimIncentive(1)).to.be.revertedWith(
        "Invalid claim"
      );

      userAfterBalance = await usdtImpl.balanceOf(user4.address);
      difference = userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      // user 3 buys tokens
      await proxy.connect(user4).buy(1, 3000000);
      // user 3 again tries to claim , should not be able to claim
      await expect(proxy.connect(user4).claimIncentive(1)).to.be.revertedWith(
        "No Incentives to claim"
      );

      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      // list second incentive
      await proxy.connect(owner).generateIncentive(1, 1000000000);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtAfterBalance.toNumber() -
        contractUsdtBeforeBalance.toNumber();
      await expect(contractDifference).to.be.eq(1000000000);

      // user 2  claim , should be able to do so , verify the variables
      userIncentiveBefore = await proxy.userIncentiveMapping(1, user2.address);
      userBeforeBalance = await usdtImpl.balanceOf(user2.address);
      userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        2,
        user2.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await proxy.connect(user2).claimIncentive(1);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      userIncentiveAfter = await proxy.userIncentiveMapping(1, user2.address);
      userAfterBalance = await usdtImpl.balanceOf(user2.address);
      difference = userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      await expect(difference).to.be.eq(userCalculatedIncentive);

      // user  3  claim , should be able to do so , verify the variables
      userIncentiveBefore = await proxy.userIncentiveMapping(1, user3.address);
      userBeforeBalance = await usdtImpl.balanceOf(user3.address);
      userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        2,
        user3.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await proxy.connect(user3).claimIncentive(1);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      userIncentiveAfter = await proxy.userIncentiveMapping(1, user3.address);
      userAfterBalance = await usdtImpl.balanceOf(user3.address);
      difference = userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      await expect(difference).to.be.eq(userCalculatedIncentive);

      // user 4 claim , should be able to do so , verify the variables
      userIncentiveBefore = await proxy.userIncentiveMapping(1, user4.address);
      userBeforeBalance = await usdtImpl.balanceOf(user4.address);

      userCalculatedIncentive = await _calculateIncentiveAmount(
        1,
        2,
        user4.address
      );
      contractUsdtBeforeBalance = await usdtImpl.balanceOf(proxy.address);
      await proxy.connect(user4).claimIncentive(1);

      contractUsdtAfterBalance = await usdtImpl.balanceOf(proxy.address);
      contractDifference =
        contractUsdtBeforeBalance.toNumber() -
        contractUsdtAfterBalance.toNumber();
      await expect(contractDifference).to.be.eq(userCalculatedIncentive);

      userIncentiveAfter = await proxy.userIncentiveMapping(1, user4.address);
      userAfterBalance = await usdtImpl.balanceOf(user4.address);
      difference = userAfterBalance.toNumber() - userBeforeBalance.toNumber();
      await expect(difference).to.be.eq(userCalculatedIncentive);
    });
  });

  // test cases for create offer methods
  describe("Create offer method", async () => {
    it("Only users who have property tokens should be able to create offers", async () => {
      // mint the property tokens
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      // user with 0 property tokens try and create an offer
      await expect(
        proxy.connect(user2).createOffer(1, 1000000, 1000000)
      ).to.be.revertedWith("Insufficient property tokens");
    });

    it("User should only be able to create offer with valid offer id", async () => {
      // mint the property tokens
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      // user with 0 property tokens try and create an offer
      await expect(
        proxy.connect(user2).createOffer(2, 1000000, 1000000)
      ).to.be.revertedWith("Invalid id");
    });

    it("User should not be able to create offers with invalid usdt and property token amount", async () => {
      // mint the property tokens
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      // user with 0 property tokens try and create an offer
      await expect(
        proxy.connect(user2).createOffer(1, 0, 1000000)
      ).to.be.revertedWith("Invalid token amount");
      await expect(
        proxy.connect(user2).createOffer(1, 1000000, 0)
      ).to.be.revertedWith("Invalid usdt amount");
    });

    it("User should be able to create offers for a given property , verify the details too ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );
      // the variables before creating offers
      // let beforeUserOfferIdMapping = await proxy.userOfferIdMapping(user2.address, 1);
      let beforeIdToOfferMapping = await proxy.idToOfferMapping(1, 1);
      let beforeIsOfferCreated = await proxy.isOfferCreated(user2.address, 1);

      // verify the before params
      // await expect(beforeUserOfferIdMapping).to.be.eq(0);

      await expect(beforeIdToOfferMapping.offerId).to.be.eq(0);
      await expect(beforeIdToOfferMapping.tokenId).to.be.eq(0);
      await expect(beforeIdToOfferMapping.tokenAmount).to.be.eq(0);
      await expect(beforeIdToOfferMapping.usdtTokenAmount).to.be.eq(0);
      await expect(beforeIdToOfferMapping.isActive).to.be.eq(false);
      await expect(beforeIdToOfferMapping.offerCreator).to.be.eq(nullAddress);

      await expect(beforeIsOfferCreated).to.be.eq(false);

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);

      // verify the after params
      // let afterUserOfferIdMapping = await proxy.userOfferIdMapping(user2.address, 1);
      let afterIdToOfferMapping = await proxy.idToOfferMapping(1, 1);
      let afterIsOfferCreated = await proxy.isOfferCreated(user2.address, 1);

      // await expect(afterUserOfferIdMapping).to.be.eq(1);

      await expect(afterIdToOfferMapping.offerId).to.be.eq(1);
      await expect(afterIdToOfferMapping.tokenId).to.be.eq(1);
      await expect(afterIdToOfferMapping.tokenAmount).to.be.eq(1000000);
      await expect(afterIdToOfferMapping.usdtTokenAmount).to.be.eq(1000000);
      await expect(afterIdToOfferMapping.isActive).to.be.eq(true);
      await expect(afterIdToOfferMapping.offerCreator).to.be.eq(user2.address);

      await expect(afterIsOfferCreated).to.be.eq(true);
    });

    it("User should not be able to create offer for a given property twice", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);

      // user2 try to create offer for this property again
      await expect(
        proxy.connect(user2).createOffer(1, 1000000, 1000000)
      ).to.be.revertedWith("Offer already created");
    });

    it("User should not be able to create offer with property token amount greater than its current balance", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000);

      // user2 creates a sell offer
      await expect(
        proxy.connect(user2).createOffer(1, 1000000, 1000000)
      ).to.be.revertedWith("Insufficient property tokens");
    });
  });

  describe("Edit offer method ", async () => {
    it("User should not be able to edit offer with invalid token id or offerId ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);

      // user2 edits the offer with invalid token  id
      await expect(
        proxy.connect(user2).editOffer(2, 1, 2000000, 2000000)
      ).to.be.revertedWith("Invalid id");

      // user2 edits the offer with invalid offer id
      await expect(
        proxy.connect(user2).editOffer(1, 2, 2000000, 2000000)
      ).to.be.revertedWith("Invalid offerId");
    });

    it("Only offer creator should be able to edit the offers.", async () => {
      let user = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);

      // user2 edits the offer with invalid token  id
      await expect(
        proxy.connect(user3).editOffer(1, 1, 2000000, 2000000)
      ).to.be.revertedWith("Offer creator needed");
    });

    it("User should not be able tp edit offer with invalid token amount or usdt amount", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 10000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);

      // user2 edits the offer with invalid usdt amount
      await expect(
        proxy.connect(user2).editOffer(1, 1, 0, 2000000)
      ).to.be.revertedWith("Invalid usdt amount");
      // user2 edits the offer with invalid token amount
      await expect(
        proxy.connect(user2).editOffer(1, 1, 2000000, 0)
      ).to.be.revertedWith("Invalid token amount");
    });

    it("User should not be able to edit offer and set token amount greater than its current balance ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 1000000, 1000000);
      // user2 edits the offer with token amount greater than its current balance
      await expect(
        proxy.connect(user2).editOffer(1, 1, 20000, 2000000000)
      ).to.be.revertedWith("Insufficient property tokens");
    });

    it(" User should be able to edit the offer with all the successfull params ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // offer params before editing offer
      let beforeEditedOffer = await proxy.idToOfferMapping(1, 1);
      await expect(beforeEditedOffer.offerId).to.be.eq(1);
      await expect(beforeEditedOffer.tokenId).to.be.eq(1);
      await expect(beforeEditedOffer.offerCreator).to.be.eq(user2.address);
      await expect(beforeEditedOffer.isActive).to.be.eq(true);
      await expect(beforeEditedOffer.tokenAmount).to.be.eq(500000);
      await expect(beforeEditedOffer.usdtTokenAmount).to.be.eq(500000);

      // user2 edits the offer
      await expect(proxy.connect(user2).editOffer(1, 1, 600000, 600000));

      // offer params after editing the offer
      let afterEditedOffer = await proxy.idToOfferMapping(1, 1);
      await expect(afterEditedOffer.offerId).to.be.eq(1);
      await expect(afterEditedOffer.tokenId).to.be.eq(1);
      await expect(afterEditedOffer.offerCreator).to.be.eq(user2.address);
      await expect(afterEditedOffer.isActive).to.be.eq(true);
      await expect(afterEditedOffer.tokenAmount).to.be.eq(500000);
      await expect(afterEditedOffer.usdtTokenAmount).to.be.eq(500000);
    });
  });

  describe("changeOfferStatus method ", async () => {
    it("User should not be able to change offer status with an invalid id or offerId ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // user2 changes offer isActive status to false
      await expect(
        proxy.connect(user2).changeOfferStatus(2, 1, false)
      ).to.be.revertedWith("Invalid id");
      await expect(
        proxy.connect(user2).changeOfferStatus(1, 2, false)
      ).to.be.revertedWith("Invalid offerId");
    });

    it("A user who is not the offer creator should not be able to change offer status", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // user try and change the offer status which he has not created
      await expect(
        proxy.connect(user).changeOfferStatus(1, 1, false)
      ).to.be.revertedWith("Offer creator needed");
    });

    it("Offer creator should be able to create offer with the correct params and verify the state variables", async () => {
      let user = signers[1];
      let user2 = signers[2];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // offer status before editing offer
      let beforeOffer = await proxy.idToOfferMapping(1, 1);
      await expect(beforeOffer.isActive).to.be.eq(true);

      // user try and change the offer status which he has not created
      await proxy.connect(user2).changeOfferStatus(1, 1, false);

      // offer status before editing offer
      let afterOffer = await proxy.idToOfferMapping(1, 1);
      await expect(afterOffer.isActive).to.be.eq(false);

      // check that all params other than isActive flag are the same as before
      await expect(beforeOffer.tokenAmount).to.be.eq(afterOffer.tokenAmount);
      await expect(beforeOffer.usdtTokenAmount).to.be.eq(
        afterOffer.usdtTokenAmount
      );
      await expect(beforeOffer.tokenId).to.be.eq(afterOffer.tokenId);
      await expect(beforeOffer.offerId).to.be.eq(afterOffer.offerId);
      await expect(beforeOffer.offerCreator).to.be.eq(afterOffer.offerCreator);
    });
  });

  describe("Accept offer method", async () => {
    it("User should not be able to call accept offer with invalid id or offer ", async () => {
      let user = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user 3 tries to accept offer when the offer has not been created yet
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 1000000)
      ).to.be.revertedWith("Invalid offerId");

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(2, 1, 1000000)
      ).to.be.revertedWith("Invalid id");
    });

    it("User should not be able to call accept offer if offer is inActive", async () => {
      let user = signers[1];
      let user2 = signers[2];
      let user3 = signers[3];
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // user 3 tries to accept offer when the offer has not been created yet
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 1000000)
      ).to.be.revertedWith("Invalid offerId");

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // user 2 deactivates the offer
      await proxy.connect(user2).changeOfferStatus(1, 1, false);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 1000000)
      ).to.be.revertedWith("Inactive Offer");
    });

    it("The offer creator should not be able to accept the offer ", async () => {
      let user = signers[1];
      let user2 = signers[2];

      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // user2 buys the property tokens
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // buying the property
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user2).acceptOffer(1, 1, 500)
      ).to.be.revertedWith("You cannot accept your own offers");
    });

    it("User should be able to accept the offer ", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // user 3 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      let sellerUsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenBeforeBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );
      let buyerUsdtBeforeBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenBeforeBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );
      let offerBeforeAccepting = await proxy.idToOfferMapping(1, 1);
      let requiredUsdtTokenAmount = await _calculateRequiredUsdtTokenAmount(
        1,
        1,
        500000
      );

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user 3 tries to accept offer with invalid tokenId
      await expect(proxy.connect(user3).acceptOffer(1, 1, 500000));
      await mineBlocks(ethers.provider, 10);

      let sellerUsdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenAfterBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );

      let buyerUsdtAfterBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenAfterBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );

      let offerAfterAccepting = await proxy.idToOfferMapping(1, 1);

      // console.log("**@ buyerUsdtBeforeBalance is , ", buyerUsdtBeforeBalance.toNumber());
      // console.log("**@ buyerUsdtAfterBalance is , ", buyerUsdtAfterBalance.toNumber());
      // console.log("**@ buyerTokenAfterBalance is , ", buyerTokenAfterBalance.toNumber());
      // console.log("**@ buyerTokenBeforeBalance is , ", buyerTokenBeforeBalance.toNumber());

      // buyer usdt balance inceases
      await expect(
        buyerUsdtBeforeBalance.toNumber() - buyerUsdtAfterBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        buyerTokenAfterBalance.toNumber() - buyerTokenBeforeBalance.toNumber()
      ).to.be.eq(500000);

      // console.log("**@ sellerUsdtAfterBalance is , ", sellerUsdtAfterBalance.toNumber());
      // console.log("**@ sellerUsdtBeforeBalance is , ", sellerUsdtBeforeBalance.toNumber());
      // console.log("**@ sellerTokenBeforeBalance is , ", sellerTokenBeforeBalance.toNumber());
      // console.log("**@ sellerTokenAfterBalance is , ", sellerTokenAfterBalance.toNumber());

      // seller usdt balance inceases
      await expect(
        sellerUsdtAfterBalance.toNumber() - sellerUsdtBeforeBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        sellerTokenBeforeBalance.toNumber() - sellerTokenAfterBalance.toNumber()
      ).to.be.eq(500000);

      await expect(offerBeforeAccepting.tokenId).to.be.eq(
        offerAfterAccepting.tokenId
      );
      await expect(offerBeforeAccepting.offerId).to.be.eq(
        offerAfterAccepting.offerId
      );
      await expect(
        offerBeforeAccepting.tokenAmount.toNumber() - 500000
      ).to.be.eq(offerAfterAccepting.tokenAmount.toNumber());
      await expect(
        offerBeforeAccepting.usdtTokenAmount.toNumber() -
          requiredUsdtTokenAmount
      ).to.be.eq(offerAfterAccepting.usdtTokenAmount.toNumber());
    });

    it("User should be able to accept partial offers ", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // second user who accepts partial offers in secondary market
      let user4 = signers[4];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user4.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // user 3 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // user 4 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user4.address, 1000000000);
      await usdtImpl.connect(user4).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      let sellerUsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenBeforeBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );
      let buyerUsdtBeforeBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenBeforeBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );
      let offerBeforeAccepting = await proxy.idToOfferMapping(1, 1);
      let requiredUsdtTokenAmount = await _calculateRequiredUsdtTokenAmount(
        1,
        1,
        250000
      );

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user 3 tries to accept partial offer
      await expect(proxy.connect(user3).acceptOffer(1, 1, 250000));
      await mineBlocks(ethers.provider, 10);

      let sellerUsdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenAfterBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );

      let buyerUsdtAfterBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenAfterBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );

      let offerAfterAccepting = await proxy.idToOfferMapping(1, 1);

      // buyer usdt balance inceases
      await expect(
        buyerUsdtBeforeBalance.toNumber() - buyerUsdtAfterBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        buyerTokenAfterBalance.toNumber() - buyerTokenBeforeBalance.toNumber()
      ).to.be.eq(250000);

      // seller usdt balance inceases
      await expect(
        sellerUsdtAfterBalance.toNumber() - sellerUsdtBeforeBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        sellerTokenBeforeBalance.toNumber() - sellerTokenAfterBalance.toNumber()
      ).to.be.eq(250000);

      await expect(offerBeforeAccepting.tokenId).to.be.eq(
        offerAfterAccepting.tokenId
      );
      await expect(offerBeforeAccepting.offerId).to.be.eq(
        offerAfterAccepting.offerId
      );
      await expect(
        offerBeforeAccepting.tokenAmount.toNumber() - 250000
      ).to.be.eq(offerAfterAccepting.tokenAmount.toNumber());
      await expect(
        offerBeforeAccepting.usdtTokenAmount.toNumber() -
          requiredUsdtTokenAmount
      ).to.be.eq(offerAfterAccepting.usdtTokenAmount.toNumber());
      // *******************************************

      // SECOND PARTIAL ACCEPTANCE OFFER , USER 4 ACCEPTS THE REMAINING OFFER

      sellerUsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      sellerTokenBeforeBalance = await creatorImpl.balanceOf(user2.address, 1);

      buyerUsdtBeforeBalance = await usdtImpl.balanceOf(user4.address);
      buyerTokenBeforeBalance = await creatorImpl.balanceOf(user4.address, 1);

      offerBeforeAccepting = await proxy.idToOfferMapping(1, 1);
      requiredUsdtTokenAmount = await _calculateRequiredUsdtTokenAmount(
        1,
        1,
        250000
      );

      await expect(proxy.connect(user4).acceptOffer(1, 1, 250000));
      await mineBlocks(ethers.provider, 10);

      sellerUsdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      sellerTokenAfterBalance = await creatorImpl.balanceOf(user2.address, 1);

      buyerUsdtAfterBalance = await usdtImpl.balanceOf(user4.address);
      buyerTokenAfterBalance = await creatorImpl.balanceOf(user4.address, 1);

      offerAfterAccepting = await proxy.idToOfferMapping(1, 1);

      // buyer usdt balance inceases
      await expect(
        buyerUsdtBeforeBalance.toNumber() - buyerUsdtAfterBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        buyerTokenAfterBalance.toNumber() - buyerTokenBeforeBalance.toNumber()
      ).to.be.eq(250000);

      // seller usdt balance inceases
      await expect(
        sellerUsdtAfterBalance.toNumber() - sellerUsdtBeforeBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        sellerTokenBeforeBalance.toNumber() - sellerTokenAfterBalance.toNumber()
      ).to.be.eq(250000);

      await expect(offerBeforeAccepting.tokenId).to.be.eq(
        offerAfterAccepting.tokenId
      );
      await expect(offerBeforeAccepting.offerId).to.be.eq(
        offerAfterAccepting.offerId
      );
      await expect(
        offerBeforeAccepting.tokenAmount.toNumber() - 250000
      ).to.be.eq(offerAfterAccepting.tokenAmount.toNumber());
      await expect(
        offerBeforeAccepting.usdtTokenAmount.toNumber() -
          requiredUsdtTokenAmount
      ).to.be.eq(offerAfterAccepting.usdtTokenAmount.toNumber());
    });

    it("User should not be  able to accept offers with token amount greater than token limit in offers ", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // second user who accepts partial offers in secondary market
      let user4 = signers[4];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user4.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // user 3 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // user 4 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user4.address, 1000000000);
      await usdtImpl.connect(user4).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      let sellerUsdtBeforeBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenBeforeBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );
      let buyerUsdtBeforeBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenBeforeBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );
      let offerBeforeAccepting = await proxy.idToOfferMapping(1, 1);
      let requiredUsdtTokenAmount = await _calculateRequiredUsdtTokenAmount(
        1,
        1,
        250000
      );

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user 3 tries to accept partial offer
      await expect(proxy.connect(user3).acceptOffer(1, 1, 250000));
      await mineBlocks(ethers.provider, 10);

      let sellerUsdtAfterBalance = await usdtImpl.balanceOf(user2.address);
      let sellerTokenAfterBalance = await creatorImpl.balanceOf(
        user2.address,
        1
      );

      let buyerUsdtAfterBalance = await usdtImpl.balanceOf(user3.address);
      let buyerTokenAfterBalance = await creatorImpl.balanceOf(
        user3.address,
        1
      );

      let offerAfterAccepting = await proxy.idToOfferMapping(1, 1);

      // buyer usdt balance inceases
      await expect(
        buyerUsdtBeforeBalance.toNumber() - buyerUsdtAfterBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        buyerTokenAfterBalance.toNumber() - buyerTokenBeforeBalance.toNumber()
      ).to.be.eq(250000);

      // seller usdt balance inceases
      await expect(
        sellerUsdtAfterBalance.toNumber() - sellerUsdtBeforeBalance.toNumber()
      ).to.be.eq(requiredUsdtTokenAmount);
      // seller property token amount decreases
      await expect(
        sellerTokenBeforeBalance.toNumber() - sellerTokenAfterBalance.toNumber()
      ).to.be.eq(250000);

      await expect(offerBeforeAccepting.tokenId).to.be.eq(
        offerAfterAccepting.tokenId
      );
      await expect(offerBeforeAccepting.offerId).to.be.eq(
        offerAfterAccepting.offerId
      );
      await expect(
        offerBeforeAccepting.tokenAmount.toNumber() - 250000
      ).to.be.eq(offerAfterAccepting.tokenAmount.toNumber());
      await expect(
        offerBeforeAccepting.usdtTokenAmount.toNumber() -
          requiredUsdtTokenAmount
      ).to.be.eq(offerAfterAccepting.usdtTokenAmount.toNumber());
      // *******************************************

      // SECOND PARTIAL ACCEPTANCE OFFER , USER 4 ACCEPTS THE REMAINING OFFER
      await expect(
        proxy.connect(user4).acceptOffer(1, 1, 270000)
      ).to.be.revertedWith("Insufficient property tokens");
    });

    it("User should not be able to accept the offer without approving sto contract to spend usdt tokens", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // user 3 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      // await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 500000)
      ).to.be.revertedWith("Usdt approval needed");
    });

    it("User should not be able to accept the offer without offer creator approving sto contract to spend its property tokens", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // user 3 gets funded usdt by owner and approves sto contract to spend its usdt
      // when it buys tokens in secondary market
      await usdtImpl.connect(owner).transfer(user3.address, 1000000000);
      // await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // offer creator approves STO to spend its property tokens
      // await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 500000)
      ).to.be.revertedWith("Property approval needed");
    });

    it("User should not be able to accept the offer with insufficient usdt balance", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000000,
          100000000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 1000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 100000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 1000000);

      // // user2 creates a sell offer
      await proxy.connect(user2).createOffer(1, 500000, 500000);

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user2).setApprovalForAll(proxy.address, true);

      // user approves sto contract to spend its usdt tokens
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 500000)
      ).to.be.revertedWith("Insufficient usdt");
    });

    it("User should not be able to accept the offer if the offer creator doesnot have enough property tokens", async () => {
      // the property owner
      let user = signers[1];

      // the property buyer
      let user2 = signers[2];

      // the user who buys property tokens in secondary market
      let user3 = signers[3];

      // owner mints property to user
      await proxy.connect(owner).whitelistAddress(user.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user2.address, 2, true);
      await proxy.connect(owner).whitelistAddress(user3.address, 2, true);

      await proxy
        .connect(owner)
        .create(
          "1",
          100000000,
          100000000,
          50000,
          user.address,
          "QmWJeNmt77RSmfgK4xeUVPbjnoNGthY98YgktsKbLDtm8Z"
        );

      // approvals

      // user 2 gets funded usdt by owner and user2 approves sto contract to spend its usdt tokens
      // when it buys tokens in primary market
      await usdtImpl.connect(owner).transfer(user2.address, 100000000000);
      await usdtImpl.connect(user2).approve(proxy.address, 1000000000000);

      await usdtImpl.connect(owner).transfer(user3.address, 100000000000);
      await usdtImpl.connect(user3).approve(proxy.address, 1000000000000);

      // owner approves sto contract to spend its usdt when user buys property tokens
      // in the primary market
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // property owner creates an offer
      await proxy.connect(user).createOffer(1, 100000000, 100000000);

      await mineBlocks(ethers.provider, 10);

      // user2 buys the property tokens
      await proxy.connect(user2).buy(1, 500);

      // offer creator approves STO to spend its property tokens
      await creatorImpl.connect(user).setApprovalForAll(proxy.address, true);

      // user approves sto contract to spend its usdt tokens
      await usdtImpl.connect(user3).approve(proxy.address, 100000000000);

      // user 3 tries to accept offer with invalid tokenId
      await expect(
        proxy.connect(user3).acceptOffer(1, 1, 100000000)
      ).to.be.revertedWith("Insufficient property tokens");
    });
  });
});
