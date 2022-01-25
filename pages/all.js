import { useRouter } from "next/router";

import governance from "@state/governance";

import Card from "@components/Card";
import Description from "@components/Description";
import Empty from "@components/Empty";
import HomeProposalLink from "@components/HomeProposalLink";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";

export default function All() {
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


  const sortProposals = (proposals) => {
    return proposals.sort((a, b) =>
        parseInt(a.id) < parseInt(b.id) ? 1 : -1
    );
  }

  return (
    <Layout short>
      {/* Path switch */}
      <center>
        <Switch
          activePath={1}
          paths={[
            {
              name: 'Home',
              url: '/',
            },
            {
              name: 'All',
              url: '/all',
            },
            {
              name: 'Assets',
              url: '/assets',
            },
          ]}
        />
      </center>

      {/* About card */}
      <Card shortMargin title="Creating a Proposal">
        <Description>
          <p>
            On Gov.Vexchange, anyone with more than 100,000 Votes can submit a Proposal
            on GovernorAlpha. If you want more people to delegate votes to you,
            We recommend that you go to the delegation channel to canvass for votes and explain
            why and how you will be acting in Vexchange's long term interests.
          </p>
          <p>
            Then comes the most important work: gathering support from the
            broader VEX community. To do that, you can go to the governance
            channel and garner votes for the proposal to pass.
          </p>
        </Description>
      </Card>

      <Card
        noPadding
        title="All proposals"
        action={{
          name: "Create Proposal",
          handler: routeToCreate,
        }}
      >
        {loadingProposals ? (
          <Loader />
        ) : proposals.length < 1 ? (
          <Empty
            content="No one has created a proposal on Gov.Vexchange yet. Check back soon."
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
            {sortProposals(proposals).map((proposal, i) => (
              <HomeProposalLink proposal={proposal} key={i} />
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}
