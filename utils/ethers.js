import { ethers } from "ethers"; // Ethers
import UNIABI from "@utils/abi/uni"; // UNI Governnace Token ABI
import { UNI_NETWORK } from "@utils/constants"; // Constants
import CrowdProposalABI from "@utils/abi/CrowdProposal"; // CrowdProposal ABI
import CrowdProposalFactoryABI from "@utils/abi/CrowdProposalFactory"; // CrowdProposalFactory ABI

// Setup network and Infura RPC
const NETWORK_MAINNET = process.env.NEXT_PUBLIC_UNIFY_MAINNET === "true";
const INFURA_RPC_ID = process.env.NEXT_PUBLIC_INFURA_RPC;
const INFURA_RPC_URL = `https://${
  // Update Infura RPC URL based on network toggle
  NETWORK_MAINNET ? "mainnet" : "kovan"
}.infura.io/v3/${INFURA_RPC_ID}`;

// Setup Ethers provider at global scope
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);
const signer = provider.getSigner();

// Setup proposal factory contract
const proposalFactory = new ethers.Contract(
  UNI_NETWORK.crowd_proposal_factory.address,
  CrowdProposalFactoryABI,
  signer
);

// Setup UNI governance token contract
const contractUNI = new ethers.Contract(
  UNI_NETWORK.uni_governance_token.address,
  UNIABI,
  provider
);

/**
 * Generates new CrowdProposal contract wrapper by address
 * @param {String} address of CrowdProposal contract
 * @returns {ethers.Contract} CrowdProposal contract at address
 */
const getProposalContract = (address) => {
  // Generate new contract
  return new ethers.Contract(address, CrowdProposalABI, provider);
};

// Export providers
export { provider, signer, contractUNI, proposalFactory, getProposalContract };
