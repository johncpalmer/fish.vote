import { useRouter } from "next/router";

import governance from "@state/governance";

import Card from "@components/Card";
import Description from "@components/Description";
import Empty from "@components/Empty";
import HomeProposalLink from "@components/HomeProposalLink";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";

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

  console.log(loadingProposals)
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
        <Description>
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
        </Description>
      </Card>

      <Card
        title="New proposals"
        action={{
          name: "Create Proposal",
          handler: routeToCreate,
        }}
      >
        {loadingProposals ? (
          <Loader />
        ) : filterNewProposals(proposals).length < 1 ? (
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
          <div>
            {filterNewProposals(proposals).map((proposal, i) => (
              <HomeProposalLink proposal={proposal} key={i} />
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}
