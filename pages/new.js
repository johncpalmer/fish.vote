import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";

import Empty from "@components/Empty";
import Card from "@components/Card";
import Layout from "@components/Layout";
import Switch from "@components/Switch";
import governance from "@state/governance";
import styles from "@styles/pages/Home.module.scss"; // Component styles

export default function New() {
  const router = useRouter(); // Setup router

  // Global state
  const { proposals, loadingProposals } = governance.useContainer();

  /**
   * Routes clicker to /create
   * @param {MouseEvent} e event to track
   */
  const routeToCreate = (e) => {
    e.preventDefault();
    router.push("/create");
  };

  /**
   * Renders status icon color based on status
   * @param {String} status of proposal
   * @returns {String} hex string of color
   */
  const renderStatusColor = (status) => {
    switch (status) {
      case "Terminated":
        return "#ff0033";
      case "In Progress":
        return "#EFC223";
      case "Proposed":
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

  /**
   * Filter proposals with less than 400 votes
   * @param {Object[]} proposals list
   * @returns {Object[]} of proposals with < 400 votes
   */
  const filterNewProposals = (proposals) => {
    // Filter array for object
    const voteFilter = proposals.filter(
      // Where votes value < 400
      (proposal) => parseFloat(proposal.votes) < 400
    );
    // Return array sorted by votes
    return voteFilter.sort((a, b) =>
      parseFloat(a.votes) < parseFloat(b.votes) ? 1 : -1
    );
  };

  return (
    <Layout short>
      {/* Path switch */}
      <center>
        <Switch
          activePath={1}
          firstPath={{ name: "Home", path: "/" }}
          secondPath={{ name: "New", path: "/new" }}
        />
      </center>

      {/* About card */}
      <Card shortMargin>
        <div className={`${styles.home__description}`}>
          <h5>Creating a proposal</h5>
          <p>
            On Vote.Vexchange, anyone can publish a{" "}
            <a
              href="https://medium.com/compound-finance/compound-autonomous-proposals-354e7a2ad6b7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crowd Proposal
            </a>
            . Then comes the most important work: gathering support from the
            broader VEX community. We recommend sharing the link to your
            proposal publicly and finding others who support you. Once your
            proposal reaches 400 delegate votes, it will be displayed on the
            Vote.Vexchange home page.
          </p>
          <p>
            Until today, only whales with 10 million votes could submit
            proposals. Now, <span>even vex can make waves</span>.
          </p>
        </div>
      </Card>

      {/* Show all automated proposals */}
      <Card
        title="New proposals"
        action={{
          name: "Create Proposal",
          handler: routeToCreate,
        }}
      >
        {loadingProposals ? (
          // If proposals are still loading, show spinner
          <div className="card__padding">
            <center>
              <Loader type="Oval" color="#f5a788" height={50} width={50} />
            </center>
          </div>
        ) : // Check if no proposals with < 400 votes
        filterNewProposals(proposals).length < 1 ? (
          <Empty
            content="No one has created a crowd proposal on Vote.Vexchange yet. Check back soon."
            link={(
              <a
                href="https://twitter.com/vexchangeio"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Follow on Twitter ->"}
              </a>
            )}
          />
          
        ) : (
          <div className={styles.home__loading}>
            {filterNewProposals(proposals).map((proposal, i) => {
              // Else if proposals exist
              return (
                // Loop over each proposal and render a proposal link
                <Link href={`/proposal/${proposal.contract}`} key={i}>
                  <a className={styles.home__proposal}>
                    {/* Proposal title + vote count */}
                    <div>
                      <h4>{proposal.title}</h4>
                      <span>{formatVoteCount(parseFloat(proposal.votes))}</span>
                    </div>

                    {/* Proposal current status */}
                    <div>
                      <div
                        style={{
                          // Render indicator light based on status
                          backgroundColor: renderStatusColor(proposal.status),
                        }}
                      />
                      <span>{proposal.status}</span>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </Layout>
  );
}
