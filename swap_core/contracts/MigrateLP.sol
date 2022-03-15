// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

import "./interfaces/IEiFiPair.sol";
import "./interfaces/IEiFiFactory.sol";

contract MigrateLP {
    address public oldFactory;
    IEiFiFactory public factory;
    uint256 public desiredLiquidity = uint256(-1);

    constructor(address _oldFactory, IEiFiFactory _factory) public {
        oldFactory = _oldFactory;
        factory = _factory;
    }

    function migrate(IEiFiPair orig) public returns (IEiFiPair) {
        require(orig.factory() == oldFactory, "not from old factory");
        address token0 = orig.token0();
        address token1 = orig.token1();
        IEiFiPair pair = IEiFiPair(factory.getPair(token0, token1));
        if (pair == IEiFiPair(address(0))) {
            pair = IEiFiPair(factory.createPair(token0, token1));
        }
        uint256 lp = orig.balanceOf(msg.sender);
        if (lp == 0) return pair;
        desiredLiquidity = lp;
        orig.transferFrom(msg.sender, address(orig), lp);
        orig.burn(address(pair));
        pair.mint(msg.sender);
        desiredLiquidity = uint256(-1);
        return pair;
    }
}
