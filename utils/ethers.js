import { ethers } from "ethers"; // Ethers
import VEXABI from "@utils/abi/vex"; // VEX Governnace Token ABI
import { VEX_NETWORK } from "@utils/constants"; // Constants

// Setup Ethers provider at global scope
// const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);
// const signer = provider.getSigner();

// Setup VEX governance token contract
// const contractVEX = new ethers.Contract(
//   VEX_NETWORK.vex_governance_token.address,
//   VEXABI,
//   provider
// );

/**
 * Generates new CrowdProposal contract wrapper by address
 * @param {String} address of CrowdProposal contract
 * @returns {ethers.Contract} CrowdProposal contract at address
 */
// const getProposalContract = (address) => {
//   // Generate new contract
//   return new ethers.Contract(address, CrowdProposalABI, undefined);
// };

// Export providers
export {
  // provider,
  // signer,
  // contractVEX,
  // getProposalContract,
};
