import { ethers } from "ethers"; // Ethers
import { UNI_NETWORK } from "@utils/constants"; // Network constants
import markdownHeadings from "markdown-headings"; // Markdown headings extraction, FIXME: refactor out external dep
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

/**
 * Parses event logs for data to retrieve for landing page
 * @param {CrowdProposalCreated[]} event raw event JSON
 * @returns {Object[]} containing contract, timestamp, and title
 */
const parseEvents = async (event) => {
  // Collect block and markdown headers from proposal description
  const block = await provider.getBlock(event.blockNumber);
  const markdownHeaders = markdownHeadings(event.args[event.args.length - 1]);

  return {
    // Deployed proposal address
    contract: event.args[0],
    // Time of deployment
    timestamp: block.timestamp,
    // Proposal title
    title:
      // If title exists
      markdownHeaders.length > 0
        ? // Remove markdown # and return string
          markdownHeaders[0].substring(2)
        : // Else, return untitled
          "Untitled Proposal",
  };
};

export default async (_, res) => {
  // Setup proposal factory contract
  const proposalFactory = new ethers.Contract(
    UNI_NETWORK.crowd_proposal_factory.address,
    CrowdProposalFactoryABI,
    signer
  );

  // Filter for all CrowdProposalCreated events
  const filter = proposalFactory.filters.CrowdProposalCreated();
  const events = (await proposalFactory.queryFilter(filter)).reverse();

  // For each event, parse to appropriate return format
  const proposals = await Promise.all(
    events.map((event) => parseEvents(event))
  );

  // Send proposals
  res.send(proposals);
};
