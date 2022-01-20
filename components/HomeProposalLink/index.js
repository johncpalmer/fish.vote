import Link from "next/link";
import { truncate } from "lodash";

import {
  State,
  Status,
  Title,
  Wrapper,
} from './styled';

/**
 * Renders status icon color based on status
 * @param {String} status of proposal
 * @returns {String} hex string of color
 */
const renderStatusColor = (status) => {
  switch (status) {
    case "Defeated":
      return "#ff0033";
    case "Queued":
      return "#EFC223";
    default:
      return "#1DB023";
  }
};

/**
 * Format vote count as locale-parsed string
 * @param {Number} votes count
 * @returns {String} vote count
 */
const formatVoteCount = (votes) => {
  // Formatter settings
  const formatSettings = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };

  // Return vote count string
  return `${votes.toLocaleString("us-en", formatSettings)} vote${
    // Adding a (s) if vote !== 1
    votes === 1 ? "" : "s"
  }`;
};

const HomeProposalLink = ({ proposal }) => (
  <Link href={`/proposal/${proposal.id || proposal.contract}`} passHref>
    <Wrapper>
      <Title>
        <h4>{truncate(proposal.title, { length: 70 })}</h4>
        <span>
          {proposal.state === "Active"
            ? "10,000,000+ votes"   /* to refactor this */
            : formatVoteCount(parseFloat(proposal.votesFor))}
        </span>
      </Title>

      <State>
        <Status>
          <div style={{ backgroundColor: renderStatusColor(proposal.state) }}></div>
        </Status>
        <div>
          <span>{proposal.state}</span>
        </div>
      </State>

    </Wrapper>
  </Link>
);

export default HomeProposalLink;
