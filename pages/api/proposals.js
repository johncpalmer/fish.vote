import { find } from 'lodash';
import { formatEther } from "ethers/lib/utils"; // Ethers conversion utils
import markdownHeadings from "markdown-headings"; // Markdown headings extraction
import GovernorAlphaABI from "@utils/abi/GovernorAlpha";
import { globalProvider, governorAlphaContract } from "@utils/globals.js";

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
 * @param {ProposalCreated[]} event raw event JSON
 * @returns {Object[]} containing contract details
 */
const parseEvents = async (event) => {
  // Collect block and markdown header
  const block = await globalProvider.thor.block(event.blockNumber).get();
  const markdownHeader = getHeader(event.args[event.args.length - 1]);

  // Collect proposal vote count
  const proposalsABI = find(GovernorAlphaABI, {name: 'proposals'});
  const proposalsMethod = governorAlphaContract.method(proposalsABI);
  const proposal = (await proposalsMethod.call(event.id)).data;

  const forVotesRaw = proposal.forVotes;
  const againstVotesRaw = proposal.againstVotes;
  // const votesParsed = formatEther(votesRaw.toString());

  // Collect proposal status
  const canceled = await proposal.canceled;
  // Setup proposal status
  const proposalStatus = canceled
    ? // If terminated return "Terminated"
      "Canceled"
    : // Else if proposal Id assigned, return Proposed
    proposalId.toString() !== "0"
    ? "Proposed"
    : // Else, return In Progress
      "In Progress";
  //
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

/**
 * Retrieves proposal creations and returns active proposals
 * @returns {Object[]} array of proposals
 */
export const collectProposals = async () => {
  // Filter for all ProposalCreated events
  const proposalCreatedABI = find(GovernorAlphaABI, {name: 'ProposalCreated' });
  const proposalCreatedEvent = governorAlphaContract.event(proposalCreatedABI);
  const filter = proposalCreatedEvent.filter([{}])

  // Limit to fetching the top 20 results
  const events = await filter.apply(0, 20);

  // For each event
  // const proposals = // Parse to appropriate return format
  // (await Promise.all(events.map((event) => parseEvents(event))))
  //   // Filter out terminated proposals
  //   .filter((proposal) => proposal.status !== "Terminated");

  return [...events];
};

export default async (_, res) => {
  // Send proposals
  res.send(await collectProposals());
};
