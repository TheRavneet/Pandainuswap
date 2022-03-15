// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

import "./EiFiPair.sol";

contract CalHash {
    function getInitHash() public pure returns (bytes32) {
        bytes memory bytecode = type(EiFiPair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}
