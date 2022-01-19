import { ethers } from "ethers";

// Declare constants by network
const VEX_CONSTANTS = {
  mainnet: {
    governor_alpha: {
      name: "Governor",
      address: "0xa0a636893Ed688076286174Bc23b34C31BED3089",
    },
    vex_governance_token: {
      name: "VEX",
      address: "0x0BD802635eb9cEB3fCBe60470D2857B86841aab6",
    },
    timelock: {
      name: "Timelock",
      address: "0x41D293Ee2924FF67Bd934fC092Be408162448f86",
    },
    factory: {
      name: "VexchangeV2Factory",
      address: "0xb312582c023cc4938cf0faea2fd609b46d7509a2"
    },
    router: {
      name: "Router",
      address: "0x6c0a6e1d922e0e63901301573370b932ae20dadb",
    },
    wvet: {
      name: "Wrapped VET",
      address: "0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997"
    }
  },
  testnet: {
    governor_alpha: {
      name: "Governor",
      address: "0x40b4F819bB35D07159AADDd415670328ecf301b5",
    },
    vex_governance_token: {
      name: "VEX",
      address: "0x10bf15c804AB02cEBb9E82CB61B200bba46C7CDE",
    },
    timelock: {
      name: "Timelock",
      address: "0xFd883d0947848eeA79bA1425fcE38b6f00dF3ea0",
    },
    factory: {
      name: "VexchangeV2Factory",
      address: "0xd15a91ee3f57313a6129a4a58c73fcbdad34c23c"
    },
    router: {
      name: "Router",
      address: "0x01d6b50b31c18d7f81ede43935cadf79901b0ea0"
    },
    wvet: {
      name: "Wrapped VET",
      address: "0x93E5Fa8011612FAB061eF58CbAB9262d2e76407b"
    }
  }
}

// Collect current network
const MAINNET = process.env.NEXT_PUBLIC_VECHAIN_MAINNET === "true";

// Return network array based on network
const VEX_NETWORK = VEX_CONSTANTS[MAINNET ? "mainnet" : "testnet"]

// Declare possible governance actions
const VEX_ACTIONS = [
  {
    contract: "VEX Token",
    address: VEX_NETWORK.vex_governance_token.address,
    functions: [
      {
        name: "Transfer",
        signature: "transfer(address,uint256)",
        args: [
          {
            name: "recipient",
            placeholder: "address",
            type: "text",
          },
          {
            name: "amount",
            placeholder: "value",
            type: "number",
          },
        ],
        values: [],
      },
      {
        name: "Approve",
        signature: "approve(address,uint256)",
        args: [
          {
            name: "spender",
            placeholder: "address",
            type: "text"
          },
          {
            name: "amount",
            placeholder: "amount",
            type: "number"
          }
        ],
        values: [],
      },
      {
        name: "Mint",
        signature: "mint(address,uint256)",
        args: [
          {
            name: "destination",
            placeholder: "address",
            type: "text"
          },
          {
            name: "amount",
            placeholder: "amount",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Burn",
        signature: "burn(uint256)",
        args: [
          {
            name: "rawAmount",
            placeholder: "amount",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Set minter",
        signature: "setMinter(address)",
        args: [
          {
            name: "newMinter",
            placeholder: "address",
            type: "text"
          }
        ],
        values: []
      }
    ],
  },
  {
    contract: "Timelock",
    address: VEX_NETWORK.timelock.address,
    functions: [
      {
        name: "Set pending admin",
        signature: "setPendingAdmin(address)",
        args: [
          {
            name: "admin",
            placeholder: "address",
            type: "text",
          },
        ],
        values: [],
      },
      {
        name: "Set timelock delay",
        signature: "setDelay(uint256)",
        args: [
          {
            name: "Delay",
            placeholder: "time in seconds. Minimum 2 days (172800), maximum 30 days (2592000)",
            type: "number"
          }
        ],
        values: [],
      }
    ],
  },
  {
    contract: "Factory",
    address: VEX_NETWORK.factory.address,
    functions: [
      {
        name: "Set platform fee to",
        signature: "setPlatformFeeTo(address)",
        args: [
          {
            name: "platformFeeTo",
            placeholder: "address",
            type: "text"
          }
        ],
        values: []
      },
      {
        name: "Set default swap fee",
        signature: "setDefaultSwapFee(uint256)",
        args: [
          {
            name: "swapFee",
            placeholder: "basis points",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Set default platform fee",
        signature: "setDefaultPlatformFee(uint256)",
        args: [
          {
            name: "platformFee",
            placeholder: "basis points",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Set default recoverer",
        signature: "setDefaultRecoverer(address)",
        args: [
          {
            name: "default recoverer",
            placeholder: "address",
            type: "text"
          }
        ],
        values: []
      },
      {
        name: "Set swap fee for pair",
        signature: "setSwapFeeForPair(address,uint256)",
        args: [
          {
            name: "pair",
            placeholder: "address",
            type: "text"
          },
          {
            name: "swapFee",
            placeholder: "basis points",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Set platform fee for pair",
        signature: "setPlatformFeeForPair(address,uint256)",
        args: [
          {
            name: "pair",
            placeholder: "address",
            type: "text"
          },
          {
            name: "platformFee",
            placeholder: "basis points",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Set recoverer for pair",
        signature: "setRecovererForPair(address,address)",
        args: [
          {
            name: "pair",
            placeholder: "address",
            type: "text"
          },
          {
            name: "recoverer",
            placeholder: "address",
            type: "text"
          }
        ],
        values: []
      }
    ]
  },
  {
    contract: "Router",
    address: VEX_NETWORK.router.address,
    functions: [
      {
        name: "Remove liquidity",
        signature: "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)",
        args: [
          {
            name: "tokenA",
            placeholder: "address",
            type: "text"
          },
          {
            name: "tokenB",
            placeholder: "address",
            type: "text"
          },
          {
            name: "liquidity",
            placeholder: "number of LP tokens",
            type: "number"
          },
          {
            name: "amountAMin",
            placeholder: "Amount A minimum",
            type: "number"
          },
          {
            name: "amountBMin",
            placeholder: "Amount B minimum",
            type: "number"
          },
          {
            name: "to",
            placeholder: "address",
            type: "text"
          },
          {
            name: "deadline",
            placeholder: "timestamp",
            type: "number"
          }
        ],
        values: []
      },
      {
        name: "Remove liquidity VET",
        signature: "removeLiquidity(address,uint256,uint256,uint256,address,uint256)",
        args: [
          {
            name: "token",
            placeholder: "address",
            type: "text"
          },
          {
            name: "liquidity",
            placeholder: "number of LP tokens",
            type: "number"
          },
          {
            name: "amountTokenMin",
            placeholder: "Token Amount Minimum",
            type: "number"
          },
          {
            name: "amountVetMin",
            placeholder: "Amount of VET minimum",
            type: "number"
          },
          {
            name: "to",
            placeholder: "address",
            type: "text"
          },
          {
            name: "deadline",
            placeholder: "timestamp",
            type: "number"
          }
        ],
        values: []
      }
    ]
  }
];

/**
 * Maps contract address to name
 * @param {String} contract address of CrowdProposal contract
 * @returns {String} contract name
 */
const collectNameByContract = (contract) => {
  let contractName = ""; // Initialize contract name

  // For each property in VEX_CONSTANTS
  for (const property of Object.keys(VEX_NETWORK)) {
    if (
      // If property is a contract type
      property !== "minimum_vex" &&
      // And the address matches
      VEX_NETWORK[property].address.toLowerCase() === contract.toLowerCase()
    ) {
      // Update contract name
      contractName = VEX_NETWORK[property].name;
    }
  }

  return contractName; // Return contract name
};

/**
 * Parses hexstring based on function signature types for appropriate params
 * @param {String} signature function signature
 * @param {String} bytes HexString
 * @returns {Object[String[], String[]]} Two arrays, one for types and one for parsed params
 */
const generateActionBySignatureBytes = (signature, bytes) => {
  // Collect types array from signature
  const typesString = signature.split("(").pop().split(")")[0];
  const typesArray = typesString.split(",");

  // Setup bytes hexstring (removing 0x prefix)
  let tempBytes = bytes.substring(2);

  // Setup array to hold parsed params
  let parsedParams = [];

  // For each type of typesArray
  for (const type of typesArray) {
    // Loop and decode + parse from tempBytes hexstring partial
    switch (type) {
      // If type of param is address
      case "address":
        // Collect address from bytes and strip zeros
        const paddedAddress = `0x${tempBytes.substring(0, 64)}`;
        const strippedAddress = ethers.utils.hexDataSlice(paddedAddress, 12);

        // Remove address bytes from tempBytes
        tempBytes = tempBytes.substring(64, tempBytes.length);

        // Update parsedParams array
        parsedParams.push(strippedAddress);
        break;
      // If type of param is uint256
      case "uint256":
        // Collect uint256 from address and strip zeros
        const paddedUint256 = `0x${tempBytes.substring(0, 64)}`;
        const strippedUint256 = ethers.utils.hexDataSlice(paddedUint256, 12);

        // Parse hexstring as BigNumber and then string
        const parsedUint256 = ethers.BigNumber.from(strippedUint256).toString();

        // Remove uint256 bytes from tempBytes
        tempBytes = tempBytes.substring(64, tempBytes.length);

        // Parse uint256 as decimal value
        const decimalUint256 = ethers.utils.formatUnits(parsedUint256, 18);

        // Updated parsedParams array
        parsedParams.push(decimalUint256);
        break;
    }
  }

  // Return array of function types and parsed params
  return { types: typesArray, parsed: parsedParams };
};

/**
 * Uses generateActionBySignatureBytes to return renderable HTML for actions
 * @param {String} signature function signature
 * @param {String} bytes HexString
 * @returns {HTMLElement[]} array of elements ot render
 */
const generateActionSignatureHTML = (signature, bytes) => {
  // Collect parsed params
  const { parsed } = generateActionBySignatureBytes(signature, bytes);
  // Generate signature name
  const signatureName = signature.split("(")[0];

  // Initialize elements array with signature name span
  let elements = [<span>{signatureName}(</span>];

  // For each parsed param
  for (let i = 0; i < parsed.length; i++) {
    const param = parsed[i];

    // Render param according to type
    if (ethers.utils.isAddress(param)) {
      // Link if type(param) === address
      elements.push(
        <a
          href={`https://explore.vechain.org/accounts/${param}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {param}
        </a>
      );
    } else {
      // Else, span
      elements.push(<span>{param}</span>);
    }

    // Add a comma span after all params unless last param
    if (i < parsed.length - 1) {
      elements.push(<span>, </span>);
    }
  }

  // Push closing function bracket and return
  elements.push(<span>)</span>);
  return elements;
};

const PROPOSAL_THRESHOLD = 100_000

// Export constants
export {
  collectNameByContract,
  generateActionSignatureHTML,
  VEX_NETWORK,
  VEX_CONSTANTS,
  VEX_ACTIONS,
  PROPOSAL_THRESHOLD
};
