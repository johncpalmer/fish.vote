import { find } from 'lodash';
import { formatEther } from "ethers/lib/utils"; // Ethers conversion utils
import markdownHeadings from "markdown-headings"; // Markdown headings extraction
import GovernorAlphaABI from "@utils/abi/GovernorAlpha";
import { governorAlphaContract } from "@utils/globals.js";
import toProposalState from "@utils/ProposalState.js";

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
 * @param {ProposalCreated} event raw event JSON
 * @returns {Object[]} containing contract details
 */
const parseProposals = async (event) => {
  // Collect block and markdown header
  const markdownHeader = getHeader(event.decoded.description);
  const proposalId = event.decoded.id;

  // Collect proposal vote count
  const proposalsABI = find(GovernorAlphaABI, {name: 'proposals'});
  const proposalsMethod = governorAlphaContract.method(proposalsABI);
  const proposal = await proposalsMethod.call(proposalId);

  const stateABI = find(GovernorAlphaABI, {name:'state'});
  const stateMethod = governorAlphaContract.method(stateABI);
  const proposalStateRaw = (await stateMethod.call(proposalId)).decoded[0];

  const votesForRaw = proposal.decoded.forVotes;
  const votesAgainstRaw = proposal.decoded.againstVotes;

  return {
    // Deployed proposal address
    id: proposalId,
    // Contract state
    state: toProposalState(proposalStateRaw),
    // Votes on both sides
    votesFor: parseFloat(formatEther(votesForRaw)),
    votesAgainst: parseFloat(formatEther(votesAgainstRaw)),
    // Time of proposal
    timestamp: event.meta.blockTimestamp,
    // Proposal title
    title: markdownHeader,
    // Proposer
    proposer: event.decoded.proposer,
    // Action parameters
    targets: event.decoded.targets,
    values: event.decoded.values,
    signatures: event.decoded.signatures,
    calldatas: event.decoded.calldatas,
    description: event.decoded.description,
    // Start and end blocks for voting
    startBlock: proposal.decoded.startBlock,
    endBlock: proposal.decoded.endBlock
  };
};

/**
 * Retrieves proposal creations and returns active proposals
 * @returns {Object[]} array of proposals
 */
export const collectProposals = async () => {
  // Filter for all ProposalCreated events
  const proposalCreatedABI = find(GovernorAlphaABI, {name: 'ProposalCreated' });
  const proposalCreatedEvent = governorAlphaContract.event(proposalCreatedABI);
  const filter = proposalCreatedEvent.filter([{}]);

  // Limit to fetching the top 20 results
  const events = await filter.apply(0, 20);

  // For each event
  const proposals = // Parse to appropriate return format
  (await Promise.all(events.map((event) => parseProposals(event))))
    // Filter out terminated proposals
    // Might want to filter out other categories of proposals too
    .filter((proposal) => proposal.state !== "Canceled");

  console.log("backend api", proposals);
  return [...proposals];
};

export default async (_, res) => {
  // Send proposals
  res.send(await collectProposals());
};
