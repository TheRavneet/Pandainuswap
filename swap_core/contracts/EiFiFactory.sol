// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

import "./interfaces/IEiFiFactory.sol";
import "./EiFiPair.sol";

contract EiFiFactory is IEiFiFactory {
    bytes32 public constant INIT_CODE_PAIR_HASH =
        keccak256(abi.encodePacked(type(EiFiPair).creationCode));

    address public feeTo;
    address public feeToSetter;
    uint24 public feeValue; //in 10**4

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    constructor(address _feeToSetter, uint24 _feeValue) public {
        feeToSetter = _feeToSetter;
        feeValue = _feeValue;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair)
    {
        require(tokenA != tokenB, "EiFi: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "EiFi: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "EiFi: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(EiFiPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IEiFiPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "EiFi: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "EiFi: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setFeeValue(uint24 _feeValue) external {
        require(msg.sender == feeToSetter, "EiFi: FORBIDDEN");
        feeValue = _feeValue;
    }
}
