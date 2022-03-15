// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface IEiFiMigrator {
    function migrate(
        address token,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external;
}
