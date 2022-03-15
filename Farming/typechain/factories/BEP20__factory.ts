/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { BEP20 } from "../BEP20";

export class BEP20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    nam: string,
    symb: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BEP20> {
    return super.deploy(nam, symb, overrides || {}) as Promise<BEP20>;
  }
  getDeployTransaction(
    nam: string,
    symb: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(nam, symb, overrides || {});
  }
  attach(address: string): BEP20 {
    return super.attach(address) as BEP20;
  }
  connect(signer: Signer): BEP20__factory {
    return super.connect(signer) as BEP20__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): BEP20 {
    return new Contract(address, _abi, signerOrProvider) as BEP20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "nam",
        type: "string",
      },
      {
        internalType: "string",
        name: "symb",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620010063803806200100683398101604081905262000034916200022e565b620000486200004262000089565b6200008d565b81516200005d906004906020850190620000dd565b50805162000073906005906020840190620000dd565b50506006805460ff1916601217905550620002e8565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054620000eb9062000295565b90600052602060002090601f0160209004810192826200010f57600085556200015a565b82601f106200012a57805160ff19168380011785556200015a565b828001600101855582156200015a579182015b828111156200015a5782518255916020019190600101906200013d565b50620001689291506200016c565b5090565b5b808211156200016857600081556001016200016d565b600082601f83011262000194578081fd5b81516001600160401b0380821115620001b157620001b1620002d2565b6040516020601f8401601f1916820181018381118382101715620001d957620001d9620002d2565b6040528382528584018101871015620001f0578485fd5b8492505b83831015620002135785830181015182840182015291820191620001f4565b838311156200022457848185840101525b5095945050505050565b6000806040838503121562000241578182fd5b82516001600160401b038082111562000258578384fd5b620002668683870162000183565b935060208501519150808211156200027c578283fd5b506200028b8582860162000183565b9150509250929050565b600281046001821680620002aa57607f821691505b60208210811415620002cc57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610d0e80620002f86000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063893d20e811610097578063a457c2d711610066578063a457c2d7146101e8578063a9059cbb146101fb578063dd62ed3e1461020e578063f2fde38b1461022157610100565b8063893d20e8146101b05780638da5cb5b146101c557806395d89b41146101cd578063a0712d68146101d557610100565b8063313ce567116100d3578063313ce5671461016b578063395093511461018057806370a0823114610193578063715018a6146101a657610100565b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014357806323b872dd14610158575b600080fd5b61010d610234565b60405161011a91906109dc565b60405180910390f35b61013661013136600461097c565b6102c6565b60405161011a91906109d1565b61014b6102e3565b60405161011a9190610bef565b610136610166366004610941565b6102e9565b610173610370565b60405161011a9190610bf8565b61013661018e36600461097c565b610379565b61014b6101a13660046108f5565b6103c7565b6101ae6103e6565b005b6101b861043a565b60405161011a91906109bd565b6101b8610449565b61010d610458565b6101366101e33660046109a5565b610467565b6101366101f636600461097c565b6104c1565b61013661020936600461097c565b610529565b61014b61021c36600461090f565b61053d565b6101ae61022f3660046108f5565b610568565b60606004805461024390610c2a565b80601f016020809104026020016040519081016040528092919081815260200182805461026f90610c2a565b80156102bc5780601f10610291576101008083540402835291602001916102bc565b820191906000526020600020905b81548152906001019060200180831161029f57829003601f168201915b5050505050905090565b60006102da6102d36105d9565b84846105dd565b50600192915050565b60035490565b60006102f6848484610691565b610366846103026105d9565b61036185604051806060016040528060288152602001610c66602891396001600160a01b038a166000908152600260205260408120906103406105d9565b6001600160a01b03168152602081019190915260400160002054919061079b565b6105dd565b5060019392505050565b60065460ff1690565b60006102da6103866105d9565b8461036185600260006103976105d9565b6001600160a01b03908116825260208083019390935260409182016000908120918c1681529252902054906107c7565b6001600160a01b0381166000908152600160205260409020545b919050565b6103ee6105d9565b6001600160a01b03166103ff610449565b6001600160a01b03161461042e5760405162461bcd60e51b815260040161042590610b35565b60405180910390fd5b61043860006107da565b565b6000610444610449565b905090565b6000546001600160a01b031690565b60606005805461024390610c2a565b60006104716105d9565b6001600160a01b0316610482610449565b6001600160a01b0316146104a85760405162461bcd60e51b815260040161042590610b35565b6104b96104b36105d9565b8361082a565b506001919050565b60006102da6104ce6105d9565b8461036185604051806060016040528060258152602001610cb460259139600260006104f86105d9565b6001600160a01b03908116825260208083019390935260409182016000908120918d1681529252902054919061079b565b60006102da6105366105d9565b8484610691565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b6105706105d9565b6001600160a01b0316610581610449565b6001600160a01b0316146105a75760405162461bcd60e51b815260040161042590610b35565b6001600160a01b0381166105cd5760405162461bcd60e51b815260040161042590610ab8565b6105d6816107da565b50565b3390565b6001600160a01b0383166106035760405162461bcd60e51b815260040161042590610a74565b6001600160a01b0382166106295760405162461bcd60e51b815260040161042590610bad565b6001600160a01b0380841660008181526002602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610684908590610bef565b60405180910390a3505050565b6001600160a01b0383166106b75760405162461bcd60e51b815260040161042590610a2f565b6001600160a01b0382166106dd5760405162461bcd60e51b815260040161042590610b6a565b61071a81604051806060016040528060268152602001610c8e602691396001600160a01b038616600090815260016020526040902054919061079b565b6001600160a01b03808516600090815260016020526040808220939093559084168152205461074990826107c7565b6001600160a01b0380841660008181526001602052604090819020939093559151908516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610684908590610bef565b600081848411156107bf5760405162461bcd60e51b815260040161042591906109dc565b505050900390565b60006107d38284610c06565b9392505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0382166108505760405162461bcd60e51b815260040161042590610afe565b60035461085d90826107c7565b6003556001600160a01b03821660009081526001602052604090205461088390826107c7565b6001600160a01b0383166000818152600160205260408082209390935591519091907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906108d2908590610bef565b60405180910390a35050565b80356001600160a01b03811681146103e157600080fd5b600060208284031215610906578081fd5b6107d3826108de565b60008060408385031215610921578081fd5b61092a836108de565b9150610938602084016108de565b90509250929050565b600080600060608486031215610955578081fd5b61095e846108de565b925061096c602085016108de565b9150604084013590509250925092565b6000806040838503121561098e578182fd5b610997836108de565b946020939093013593505050565b6000602082840312156109b6578081fd5b5035919050565b6001600160a01b0391909116815260200190565b901515815260200190565b6000602080835283518082850152825b81811015610a08578581018301518582016040015282016109ec565b81811115610a195783604083870101525b50601f01601f1916929092016040019392505050565b60208082526025908201527f42455032303a207472616e736665722066726f6d20746865207a65726f206164604082015264647265737360d81b606082015260800190565b60208082526024908201527f42455032303a20617070726f76652066726f6d20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b6020808252601f908201527f42455032303a206d696e7420746f20746865207a65726f206164647265737300604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526023908201527f42455032303a207472616e7366657220746f20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526022908201527f42455032303a20617070726f766520746f20746865207a65726f206164647265604082015261737360f01b606082015260800190565b90815260200190565b60ff91909116815260200190565b60008219821115610c2557634e487b7160e01b81526011600452602481fd5b500190565b600281046001821680610c3e57607f821691505b60208210811415610c5f57634e487b7160e01b600052602260045260246000fd5b5091905056fe42455032303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636542455032303a207472616e7366657220616d6f756e7420657863656564732062616c616e636542455032303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220a3e808bea80ca06b1487b280b0cb5c9a5191a4888cf75fbeaef2c9303fb7794f64736f6c63430008000033";