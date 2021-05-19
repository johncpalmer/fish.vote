import {
  provider,
  contractUNI,
  proposalFactory,
  getProposalContract,
} from "@utils/ethers"; // Ethers imports
import { formatEther } from "ethers/lib/utils"; // Ethers conversion utils
import markdownHeadings from "markdown-headings"; // Markdown headings extraction

/**
 * Collects header from Markdown
 * @param {String} markdown of CrowdProposal
 * @returns {String} header content
 */
const getHeader = (markdown) => {
  // Collect markdown headers from proposal description
  const markdownHeaders = markdownHeadings(markdown);

  // If title exists
  return markdownHeaders.length > 0
    ? // Remove markdown # and return string
      markdownHeaders[0].substring(2)
    : // Else, return untitled
      "Untitled Proposal";
};

/**
 * Parses event logs for data to retrieve for landing page
 * @param {CrowdProposalCreated[]} event raw event JSON
 * @returns {Object[]} containing contract details
 */
const parseEvents = async (event) => {
  // Collect block and markdown header
  const block = await provider.getBlock(event.blockNumber);
  const markdownHeader = getHeader(event.args[event.args.length - 1]);

  // Collect proposal vote count
  const votesRaw = await contractUNI.getCurrentVotes(event.args[0]);
  const votesParsed = formatEther(votesRaw.toString());

  // Collect proposal status
  const proposalContract = getProposalContract(event.args[0]);
  const proposalId = await proposalContract.govProposalId();
  const terminated = await proposalContract.terminated();
  // Setup proposal status
  const proposalStatus = terminated
    ? // If terminated return "Terminated"
      "Terminated"
    : // Else if proposal Id assigned, return Proposed
    proposalId.toString() !== "0"
    ? "Proposed"
    : // Else, return In Progress
      "In Progress";

  return {
    // Deployed proposal address
    contract: event.args[0],
    // Contract status
    status: proposalStatus,
    // Contract vote count
    votes: votesParsed,
    // Time of deployment
    timestamp: block.timestamp,
    // Proposal title
    title: markdownHeader,
    // Contract arguments
    args: event.args,
  };
};

export default async (_, res) => {
  // Filter for all CrowdProposalCreated events
  const filter = proposalFactory.filters.CrowdProposalCreated();
  const events = (await proposalFactory.queryFilter(filter)).reverse();

  // For each event
  const proposals = // Parse to appropriate return format
  (await Promise.all(events.map((event) => parseEvents(event))))
    // Filter out terminated proposals
    .filter((proposal) => proposal.status !== "Terminated");

  // Send proposals
  res.send(proposals);
};
