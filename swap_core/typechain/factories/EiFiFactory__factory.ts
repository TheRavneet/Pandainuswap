/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { EiFiFactory } from "../EiFiFactory";

export class EiFiFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _feeToSetter: string,
    _feeValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EiFiFactory> {
    return super.deploy(
      _feeToSetter,
      _feeValue,
      overrides || {}
    ) as Promise<EiFiFactory>;
  }
  getDeployTransaction(
    _feeToSetter: string,
    _feeValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_feeToSetter, _feeValue, overrides || {});
  }
  attach(address: string): EiFiFactory {
    return super.attach(address) as EiFiFactory;
  }
  connect(signer: Signer): EiFiFactory__factory {
    return super.connect(signer) as EiFiFactory__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EiFiFactory {
    return new Contract(address, _abi, signerOrProvider) as EiFiFactory;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeToSetter",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_feeValue",
        type: "uint24",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "PairCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "INIT_CODE_PAIR_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allPairs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "allPairsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "createPair",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToSetter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeValue",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_feeTo",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_feeToSetter",
        type: "address",
      },
    ],
    name: "setFeeToSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint24",
        name: "_feeValue",
        type: "uint24",
      },
    ],
    name: "setFeeValue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051612bc6380380612bc68339818101604052604081101561003357600080fd5b508051602090910151600180546001600160a01b0319166001600160a01b039093169290921762ffffff60a01b1916600160a01b62ffffff90921691909102179055612b42806100846000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80635855a25a116100715780635855a25a146101355780639fddaa931461013d578063a2e74af61461015d578063c9c6539614610183578063e6a43905146101b1578063f46901ed146101df576100a9565b8063017e7e58146100ae578063094b7415146100d25780631e3dd18b146100da57806355d92b97146100f7578063574f2ba31461011b575b600080fd5b6100b6610205565b604080516001600160a01b039092168252519081900360200190f35b6100b6610214565b6100b6600480360360208110156100f057600080fd5b5035610223565b6101196004803603602081101561010d57600080fd5b503562ffffff1661024a565b005b6101236102bf565b60408051918252519081900360200190f35b6101236102c5565b610145610358565b6040805162ffffff9092168252519081900360200190f35b6101196004803603602081101561017357600080fd5b50356001600160a01b031661036a565b6100b66004803603604081101561019957600080fd5b506001600160a01b03813581169160200135166103dd565b6100b6600480360360408110156101c757600080fd5b506001600160a01b03813581169160200135166106fe565b610119600480360360208110156101f557600080fd5b50356001600160a01b0316610724565b6000546001600160a01b031681565b6001546001600160a01b031681565b6003818154811061023057fe5b6000918252602090912001546001600160a01b0316905081565b6001546001600160a01b0316331461029b576040805162461bcd60e51b815260206004820152600f60248201526e22b4a3349d102327a92124a22222a760891b604482015290519081900360640190fd5b6001805462ffffff909216600160a01b0262ffffff60a01b19909216919091179055565b60035490565b6040516102d460208201610797565b6020820181038252601f19601f820116604052506040516020018082805190602001908083835b6020831061031a5780518252601f1990920191602091820191016102fb565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b600154600160a01b900462ffffff1681565b6001546001600160a01b031633146103bb576040805162461bcd60e51b815260206004820152600f60248201526e22b4a3349d102327a92124a22222a760891b604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6000816001600160a01b0316836001600160a01b03161415610446576040805162461bcd60e51b815260206004820152601960248201527f456946693a204944454e544943414c5f41444452455353455300000000000000604482015290519081900360640190fd5b600080836001600160a01b0316856001600160a01b03161061046957838561046c565b84845b90925090506001600160a01b0382166104c1576040805162461bcd60e51b8152602060048201526012602482015271456946693a205a45524f5f4144445245535360701b604482015290519081900360640190fd5b6001600160a01b0382811660009081526002602090815260408083208585168452909152902054161561052f576040805162461bcd60e51b8152602060048201526011602482015270456946693a20504149525f45584953545360781b604482015290519081900360640190fd5b60606040518060200161054190610797565b6020820181038252601f19601f8201166040525090506000838360405160200180836001600160a01b03166001600160a01b031660601b8152601401826001600160a01b03166001600160a01b031660601b815260140192505050604051602081830303815290604052805190602001209050808251602084016000f56040805163485cc95560e01b81526001600160a01b038781166004830152868116602483015291519297509087169163485cc9559160448082019260009290919082900301818387803b15801561061457600080fd5b505af1158015610628573d6000803e3d6000fd5b505050506001600160a01b0384811660008181526002602081815260408084208987168086529083528185208054978d166001600160a01b031998891681179091559383528185208686528352818520805488168517905560038054600181018255958190527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b90950180549097168417909655925483519283529082015281517f0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9929181900390910190a35050505092915050565b60026020908152600092835260408084209091529082529020546001600160a01b031681565b6001546001600160a01b03163314610775576040805162461bcd60e51b815260206004820152600f60248201526e22b4a3349d102327a92124a22222a760891b604482015290519081900360640190fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b612369806107a58339019056fe60806040526001600c5534801561001557600080fd5b5060405146908060526123178239604080519182900360520182208282018252600883526745694669204c507360c01b6020938401528151808301835260018152603160f81b908401528151808401919091527f404a48f9b0f18820f9404d388015600cf394e27bdeb3f788db08ba612b1010c2818301527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015260808101949094523060a0808601919091528151808603909101815260c09094019052825192019190912060035550600580546001600160a01b03191633179055612214806101036000396000f3fe608060405234801561001057600080fd5b50600436106101a95760003560e01c80636a627842116100f9578063ba9a7a5611610097578063d21220a711610071578063d21220a714610534578063d505accf1461053c578063dd62ed3e1461058d578063fff6cae9146105bb576101a9565b8063ba9a7a56146104fe578063bc25cf7714610506578063c45a01551461052c576101a9565b80637ecebe00116100d35780637ecebe001461046557806389afcb441461048b57806395d89b41146104ca578063a9059cbb146104d2576101a9565b80636a6278421461041157806370a08231146104375780637464fc3d1461045d576101a9565b806323b872dd116101665780633644e515116101405780633644e515146103cb578063485cc955146103d35780635909c0d5146104015780635a3d549314610409576101a9565b806323b872dd1461036f57806330adf81f146103a5578063313ce567146103ad576101a9565b8063022c0d9f146101ae57806306fdde031461023c5780630902f1ac146102b9578063095ea7b3146102f15780630dfe16811461033157806318160ddd14610355575b600080fd5b61023a600480360360808110156101c457600080fd5b8135916020810135916001600160a01b0360408301351691908101906080810160608201356401000000008111156101fb57600080fd5b82018360208201111561020d57600080fd5b8035906020019184600183028401116401000000008311171561022f57600080fd5b5090925090506105c3565b005b610244610b31565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561027e578181015183820152602001610266565b50505050905090810190601f1680156102ab5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102c1610b55565b604080516001600160701b03948516815292909316602083015263ffffffff168183015290519081900360600190f35b61031d6004803603604081101561030757600080fd5b506001600160a01b038135169060200135610b7f565b604080519115158252519081900360200190f35b610339610b96565b604080516001600160a01b039092168252519081900360200190f35b61035d610ba5565b60408051918252519081900360200190f35b61031d6004803603606081101561038557600080fd5b506001600160a01b03813581169160208101359091169060400135610bab565b61035d610c45565b6103b5610c69565b6040805160ff9092168252519081900360200190f35b61035d610c6e565b61023a600480360360408110156103e957600080fd5b506001600160a01b0381358116916020013516610c74565b61035d610cf3565b61035d610cf9565b61035d6004803603602081101561042757600080fd5b50356001600160a01b0316610cff565b61035d6004803603602081101561044d57600080fd5b50356001600160a01b0316610ffa565b61035d61100c565b61035d6004803603602081101561047b57600080fd5b50356001600160a01b0316611012565b6104b1600480360360208110156104a157600080fd5b50356001600160a01b0316611024565b6040805192835260208301919091528051918290030190f35b6102446113c5565b61031d600480360360408110156104e857600080fd5b506001600160a01b0381351690602001356113e8565b61035d6113f5565b61023a6004803603602081101561051c57600080fd5b50356001600160a01b03166113fb565b610339611561565b610339611570565b61023a600480360360e081101561055257600080fd5b506001600160a01b03813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c0013561157f565b61035d600480360360408110156105a357600080fd5b506001600160a01b038135811691602001351661177c565b61023a611799565b600c54600114610609576040805162461bcd60e51b815260206004820152600c60248201526b115a519a4e881313d0d2d15160a21b604482015290519081900360640190fd5b6000600c558415158061061c5750600084115b61066d576040805162461bcd60e51b815260206004820181905260248201527f456946693a20494e53554646494349454e545f4f55545055545f414d4f554e54604482015290519081900360640190fd5b600080610678610b55565b5091509150816001600160701b03168710801561069d5750806001600160701b031686105b6106ee576040805162461bcd60e51b815260206004820152601c60248201527f456946693a20494e53554646494349454e545f4c495155494449545900000000604482015290519081900360640190fd5b60065460075460009182916001600160a01b0391821691908116908916821480159061072c5750806001600160a01b0316896001600160a01b031614155b610770576040805162461bcd60e51b815260206004820152601060248201526f456946693a20494e56414c49445f544f60801b604482015290519081900360640190fd5b8a1561078157610781828a8d6118f6565b891561079257610792818a8c6118f6565b861561084d57886001600160a01b031663e99fa8fc338d8d8c8c6040518663ffffffff1660e01b815260040180866001600160a01b03166001600160a01b03168152602001858152602001848152602001806020018281038252848482818152602001925080828437600081840152601f19601f8201169050808301925050509650505050505050600060405180830381600087803b15801561083457600080fd5b505af1158015610848573d6000803e3d6000fd5b505050505b604080516370a0823160e01b815230600482015290516001600160a01b038416916370a08231916024808301926020929190829003018186803b15801561089357600080fd5b505afa1580156108a7573d6000803e3d6000fd5b505050506040513d60208110156108bd57600080fd5b5051604080516370a0823160e01b815230600482015290519195506001600160a01b038316916370a0823191602480820192602092909190829003018186803b15801561090957600080fd5b505afa15801561091d573d6000803e3d6000fd5b505050506040513d602081101561093357600080fd5b5051925060009150506001600160701b0385168a90038311610956576000610965565b89856001600160701b03160383035b9050600089856001600160701b0316038311610982576000610991565b89856001600160701b03160383035b905060008211806109a25750600081115b6109f3576040805162461bcd60e51b815260206004820152601f60248201527f456946693a20494e53554646494349454e545f494e5055545f414d4f554e5400604482015290519081900360640190fd5b6000610a27610a0984600263ffffffff611a8816565b610a1b876103e863ffffffff611a8816565b9063ffffffff611aeb16565b90506000610a3f610a0984600263ffffffff611a8816565b9050610a70620f4240610a646001600160701b038b8116908b1663ffffffff611a8816565b9063ffffffff611a8816565b610a80838363ffffffff611a8816565b1015610abd576040805162461bcd60e51b8152602060048201526007602482015266456946693a204b60c81b604482015290519081900360640190fd5b5050610acb84848888611b3b565b60408051838152602081018390528082018d9052606081018c905290516001600160a01b038b169133917fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229181900360800190a350506001600c55505050505050505050565b6040518060400160405280600881526020016745694669204c507360c01b81525081565b6008546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b6000610b8c338484611cfb565b5060015b92915050565b6006546001600160a01b031681565b60005481565b6001600160a01b038316600090815260026020908152604080832033845290915281205460001914610c30576001600160a01b0384166000908152600260209081526040808320338452909152902054610c0b908363ffffffff611aeb16565b6001600160a01b03851660009081526002602090815260408083203384529091529020555b610c3b848484611d5d565b5060019392505050565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b601281565b60035481565b6005546001600160a01b03163314610cc5576040805162461bcd60e51b815260206004820152600f60248201526e22b4a3349d102327a92124a22222a760891b604482015290519081900360640190fd5b600680546001600160a01b039384166001600160a01b03199182161790915560078054929093169116179055565b60095481565b600a5481565b6000600c54600114610d47576040805162461bcd60e51b815260206004820152600c60248201526b115a519a4e881313d0d2d15160a21b604482015290519081900360640190fd5b6000600c81905580610d57610b55565b50600654604080516370a0823160e01b815230600482015290519395509193506000926001600160a01b03909116916370a08231916024808301926020929190829003018186803b158015610dab57600080fd5b505afa158015610dbf573d6000803e3d6000fd5b505050506040513d6020811015610dd557600080fd5b5051600754604080516370a0823160e01b815230600482015290519293506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610e2857600080fd5b505afa158015610e3c573d6000803e3d6000fd5b505050506040513d6020811015610e5257600080fd5b505190506000610e71836001600160701b03871663ffffffff611aeb16565b90506000610e8e836001600160701b03871663ffffffff611aeb16565b90506000610e9c8787611e17565b60005490915080610ed957610ec56103e8610a1b610ec0878763ffffffff611a8816565b611f75565b9850610ed460006103e8611fc7565b610f28565b610f256001600160701b038916610ef6868463ffffffff611a8816565b81610efd57fe5b046001600160701b038916610f18868563ffffffff611a8816565b81610f1f57fe5b0461205d565b98505b60008911610f675760405162461bcd60e51b815260040180806020018281038252602381526020018061219a6023913960400191505060405180910390fd5b610f718a8a611fc7565b610f7d86868a8a611b3b565b8115610fad57600854610fa9906001600160701b0380821691600160701b90041663ffffffff611a8816565b600b555b6040805185815260208101859052815133927f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f928290030190a250506001600c5550949695505050505050565b60016020526000908152604090205481565b600b5481565b60046020526000908152604090205481565b600080600c5460011461106d576040805162461bcd60e51b815260206004820152600c60248201526b115a519a4e881313d0d2d15160a21b604482015290519081900360640190fd5b6000600c8190558061107d610b55565b50600654600754604080516370a0823160e01b815230600482015290519496509294506001600160a01b039182169391169160009184916370a08231916024808301926020929190829003018186803b1580156110d957600080fd5b505afa1580156110ed573d6000803e3d6000fd5b505050506040513d602081101561110357600080fd5b5051604080516370a0823160e01b815230600482015290519192506000916001600160a01b038516916370a08231916024808301926020929190829003018186803b15801561115157600080fd5b505afa158015611165573d6000803e3d6000fd5b505050506040513d602081101561117b57600080fd5b50513060009081526001602052604081205491925061119a8888611e17565b600054909150806111b1848763ffffffff611a8816565b816111b857fe5b049a50806111cc848663ffffffff611a8816565b816111d357fe5b04995060008b1180156111e6575060008a115b6112215760405162461bcd60e51b81526004018080602001828103825260238152602001806121bd6023913960400191505060405180910390fd5b61122b3084612075565b611236878d8d6118f6565b611241868d8c6118f6565b604080516370a0823160e01b815230600482015290516001600160a01b038916916370a08231916024808301926020929190829003018186803b15801561128757600080fd5b505afa15801561129b573d6000803e3d6000fd5b505050506040513d60208110156112b157600080fd5b5051604080516370a0823160e01b815230600482015290519196506001600160a01b038816916370a0823191602480820192602092909190829003018186803b1580156112fd57600080fd5b505afa158015611311573d6000803e3d6000fd5b505050506040513d602081101561132757600080fd5b5051935061133785858b8b611b3b565b811561136757600854611363906001600160701b0380821691600160701b90041663ffffffff611a8816565b600b555b604080518c8152602081018c905281516001600160a01b038f169233927fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496929081900390910190a35050505050505050506001600c81905550915091565b604051806040016040528060078152602001660456946692d4c560cc1b81525081565b6000610b8c338484611d5d565b6103e881565b600c54600114611441576040805162461bcd60e51b815260206004820152600c60248201526b115a519a4e881313d0d2d15160a21b604482015290519081900360640190fd5b6000600c55600654600754600854604080516370a0823160e01b815230600482015290516001600160a01b0394851694909316926114f092859287926114eb926001600160701b03169185916370a0823191602480820192602092909190829003018186803b1580156114b357600080fd5b505afa1580156114c7573d6000803e3d6000fd5b505050506040513d60208110156114dd57600080fd5b50519063ffffffff611aeb16565b6118f6565b600854604080516370a0823160e01b8152306004820152905161155792849287926114eb92600160701b90046001600160701b0316916001600160a01b038616916370a0823191602480820192602092909190829003018186803b1580156114b357600080fd5b50506001600c5550565b6005546001600160a01b031681565b6007546001600160a01b031681565b428410156115c4576040805162461bcd60e51b815260206004820152600d60248201526c115a519a4e8811561412549151609a1b604482015290519081900360640190fd5b6003546001600160a01b0380891660008181526004602090815260408083208054600180820190925582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98186015280840196909652958d166060860152608085018c905260a085019590955260c08085018b90528151808603909101815260e08501825280519083012061190160f01b6101008601526101028501969096526101228085019690965280518085039096018652610142840180825286519683019690962095839052610162840180825286905260ff89166101828501526101a284018890526101c28401879052519193926101e280820193601f1981019281900390910190855afa1580156116df573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116158015906117155750886001600160a01b0316816001600160a01b0316145b611766576040805162461bcd60e51b815260206004820152601760248201527f456946693a20494e56414c49445f5349474e4154555245000000000000000000604482015290519081900360640190fd5b611771898989611cfb565b505050505050505050565b600260209081526000928352604080842090915290825290205481565b600c546001146117df576040805162461bcd60e51b815260206004820152600c60248201526b115a519a4e881313d0d2d15160a21b604482015290519081900360640190fd5b6000600c55600654604080516370a0823160e01b815230600482015290516118ef926001600160a01b0316916370a08231916024808301926020929190829003018186803b15801561183057600080fd5b505afa158015611844573d6000803e3d6000fd5b505050506040513d602081101561185a57600080fd5b5051600754604080516370a0823160e01b815230600482015290516001600160a01b03909216916370a0823191602480820192602092909190829003018186803b1580156118a757600080fd5b505afa1580156118bb573d6000803e3d6000fd5b505050506040513d60208110156118d157600080fd5b50516008546001600160701b0380821691600160701b900416611b3b565b6001600c55565b604080518082018252601981527f7472616e7366657228616464726573732c75696e74323536290000000000000060209182015281516001600160a01b0385811660248301526044808301869052845180840390910181526064909201845291810180516001600160e01b031663a9059cbb60e01b1781529251815160009460609489169392918291908083835b602083106119a35780518252601f199092019160209182019101611984565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611a05576040519150601f19603f3d011682016040523d82523d6000602084013e611a0a565b606091505b5091509150818015611a38575080511580611a385750808060200190516020811015611a3557600080fd5b50515b611a81576040805162461bcd60e51b8152602060048201526015602482015274115a519a4e881514905394d1915497d19052531151605a1b604482015290519081900360640190fd5b5050505050565b6000811580611aa357505080820282828281611aa057fe5b04145b610b90576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6d756c2d6f766572666c6f7760601b604482015290519081900360640190fd5b80820382811115610b90576040805162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015290519081900360640190fd5b6001600160701b038411801590611b5957506001600160701b038311155b611b9b576040805162461bcd60e51b815260206004820152600e60248201526d456946693a204f564552464c4f5760901b604482015290519081900360640190fd5b60085463ffffffff42811691600160e01b90048116820390811615801590611bcb57506001600160701b03841615155b8015611bdf57506001600160701b03831615155b15611c50578063ffffffff16611c0d85611bf886612113565b6001600160e01b03169063ffffffff61212516565b600980546001600160e01b03929092169290920201905563ffffffff8116611c3884611bf887612113565b600a80546001600160e01b0392909216929092020190555b600880546dffffffffffffffffffffffffffff19166001600160701b03888116919091176dffffffffffffffffffffffffffff60701b1916600160701b8883168102919091176001600160e01b0316600160e01b63ffffffff871602179283905560408051848416815291909304909116602082015281517f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1929181900390910190a1505050505050565b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b038316600090815260016020526040902054611d86908263ffffffff611aeb16565b6001600160a01b038085166000908152600160205260408082209390935590841681522054611dbb908263ffffffff61214a16565b6001600160a01b0380841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600080600560009054906101000a90046001600160a01b03166001600160a01b031663017e7e586040518163ffffffff1660e01b815260040160206040518083038186803b158015611e6857600080fd5b505afa158015611e7c573d6000803e3d6000fd5b505050506040513d6020811015611e9257600080fd5b5051600b546001600160a01b038216158015945091925090611f61578015611f5c576000611ed5610ec06001600160701b0388811690881663ffffffff611a8816565b90506000611ee283611f75565b905080821115611f59576000611f10611f01848463ffffffff611aeb16565b6000549063ffffffff611a8816565b90506000611f3583611f2986600363ffffffff611a8816565b9063ffffffff61214a16565b90506000818381611f4257fe5b0490508015611f5557611f558782611fc7565b5050505b50505b611f6d565b8015611f6d576000600b555b505092915050565b60006003821115611fb8575080600160028204015b81811015611fb257809150600281828581611fa157fe5b040181611faa57fe5b049050611f8a565b50611fc2565b8115611fc2575060015b919050565b600054611fda908263ffffffff61214a16565b60009081556001600160a01b038316815260016020526040902054612005908263ffffffff61214a16565b6001600160a01b03831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b600081831061206c578161206e565b825b9392505050565b6001600160a01b03821660009081526001602052604090205461209e908263ffffffff611aeb16565b6001600160a01b038316600090815260016020526040812091909155546120cb908263ffffffff611aeb16565b60009081556040805183815290516001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef919081900360200190a35050565b6001600160701b0316600160701b0290565b60006001600160701b0382166001600160e01b0384168161214257fe5b049392505050565b80820182811015610b90576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015290519081900360640190fdfe456946693a20494e53554646494349454e545f4c49515549444954595f4d494e544544456946693a20494e53554646494349454e545f4c49515549444954595f4255524e4544a265627a7a7231582007d8c89aa4a9e2cb909408a2cd00710ee70f1d4c88b6c1942fdfde426530225264736f6c63430005110032454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429a265627a7a7231582016b29aefaa37cbf6eb5f4d12d328f5c208bfe1a13423917ad1239577aecfc58b64736f6c63430005110032";
