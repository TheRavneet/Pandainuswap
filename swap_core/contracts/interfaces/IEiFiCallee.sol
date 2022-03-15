// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

interface IEiFiCallee {
    function EiFiCall(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}
