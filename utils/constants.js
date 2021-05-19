import { ethers } from "ethers";

// Declare constants by network
const UNI_CONSTANTS = {
  mainnet: {
    minimum_uni: 0,
    governer_alpha: {
      name: "Governer",
      address: "0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F",
    },
    uni_governance_token: {
      name: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    timelock: {
      name: "Timelock",
      address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    },
    crowd_proposal_factory: {
      name: "Proposal_Factory",
      address: "",
    },
  },
  kovan: {
    minimum_uni: 0,
    governer_alpha: {
      name: "Governer",
      address: "0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F",
    },
    uni_governance_token: {
      name: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    timelock: {
      name: "Timelock",
      address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    },
    crowd_proposal_factory: {
      name: "Proposal_Factory",
      address: "0x8b00c3151dcc62213ea0f0a409103e18118acd85",
    },
  },
};

// Collect current network
const MAINNET = process.env.NEXT_PUBLIC_UNIFY_MAINNET === "true";
// Return network array based on network
const UNI_NETWORK = UNI_CONSTANTS[MAINNET ? "mainnet" : "kovan"];

// Declare possible governance actions
const UNI_ACTIONS = [
  {
    contract: "UNI Token",
    address: UNI_NETWORK.uni_governance_token.address,
    functions: [
      {
        name: "transfer",
        signature: "transfer(address,uint256)",
        targets: [
          {
            name: "recipient",
            placeholder: "address",
            type: "text",
          },
        ],
        values: [
          {
            name: "amount",
            placeholder: "value",
            type: "number",
          },
        ],
      },
    ],
  },
  {
    contract: "Timelock",
    address: UNI_NETWORK.timelock.address,
    functions: [
      {
        name: "Set Pending Admin",
        signature: "setPendingAdmin(address)",
        targets: [
          {
            name: "admin",
            placeholder: "address",
            type: "text",
          },
        ],
        values: [],
      },
    ],
  },
];

/**
 * Maps contract address to name
 * @param {String} contract address of CrowdProposal contract
 * @returns {String} contract name
 */
const collectNameByContract = (contract) => {
  let contractName = ""; // Initialize contract name

  // For each property in UNI_CONSTANTS
  for (const property of Object.keys(UNI_NETWORK)) {
    if (
      // If property is a contract type
      property !== "minimum_uni" &&
      // And the address matches
      UNI_NETWORK[property].address.toLowerCase() === contract.toLowerCase()
    ) {
      // Update contract name
      contractName = UNI_NETWORK[property].name;
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
          href={`https://etherscan.io/address/${param}`}
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

// Export constants
export {
  collectNameByContract,
  generateActionSignatureHTML,
  UNI_NETWORK,
  UNI_CONSTANTS,
  UNI_ACTIONS,
};
