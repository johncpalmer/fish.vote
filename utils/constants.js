// Declare constants by network
const UNI_CONSTANTS = {
  mainnet: {
    minimum_uni: 100,
    governer_alpha: {
      address: "0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F",
    },
    uni_governance_token: {
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    },
    timelock: {
      address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    },
    crowd_proposal_factory: {
      address: "",
    },
  },
  kovan: {
    minimum_uni: 0.5,
    governer_alpha: {
      address: "0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F",
    },
    uni_governance_token: {
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    },
    timelock: {
      address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    },
    crowd_proposal_factory: {
      address: "0x9a4920f5550772028493ed92ae2316aaF0b26cF4",
    },
  },
};

// Collect current network
const UNI_NETWORK =
  // based on environment variables
  UNI_CONSTANTS[
    process.env.NEXT_PUBLIC_UNIFY_MAINNET === "true" ? "mainnet" : "kovan"
  ];

// Declare possible governance actions
const UNI_ACTIONS = [
  {
    contract: "UNI Token",
    address: UNI_NETWORK.uni_governance_token.address,
    functions: [
      {
        name: "transfer",
        signature: "transfer(address, uint256)",
        targets: [
          {
            name: "recipient",
            placeholder: "address",
            type: "address",
            inputType: "text",
          },
        ],
        values: [
          {
            name: "amount",
            placeholder: "value (18 decimals)",
            type: "uint256",
            inputType: "number",
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

// Export constants
export { UNI_NETWORK, UNI_CONSTANTS, UNI_ACTIONS };
