import markdownHeadings from "markdown-headings"; // Markdown headings extraction
import { provider, proposalFactory } from "@utils/ethers"; // Ethers imports

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
 * @returns {Object[]} containing contract, timestamp, and title
 */
const parseEvents = async (event) => {
  // Collect block and markdown header
  const block = await provider.getBlock(event.blockNumber);
  const markdownHeader = getHeader(event.args[event.args.length - 1]);

  return {
    // Deployed proposal address
    contract: event.args[0],
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

  // For each event, parse to appropriate return format
  const proposals = await Promise.all(
    events.map((event) => parseEvents(event))
  );

  // Send proposals
  res.send(proposals);
};