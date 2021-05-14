import Layout from "@components/Layout"; // Component: Layout
import { useRouter } from "next/router"; // Routing
import governance from "@state/governance"; // Global governance state
import { useState, useEffect } from "react"; // React state management
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import Card from "@components/Card";
import styles from "@styles/pages/Proposal.module.scss";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import eth from "@state/eth";

export default function Proposal({ address }) {
  // Routing
  const router = useRouter();

  // Global state
  const { address: authed, unlock } = eth.useContainer();
  const { uni, collectProposalByContract } = governance.useContainer();

  // Local state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch proposal details
   */
  const fetchProposal = async () => {
    // Collect proposal from global state (or pull if no proposals exist)
    const proposal = await collectProposalByContract(address);

    // If proposal does not exist
    if (!proposal.success) {
      // Return to "/"
      await router.push("/");
    }

    // Else, toggle loading and update data
    setData(proposal.data);
    console.log(proposal.data);
    setLoading(false);
  };

  useEffect(fetchProposal, []);

  return (
    <Layout>
      {!loading ? (
        <>
          <Breadcrumb
            title={data.title}
            lastRoute={{
              path: "/",
              name: "Autonomous Proposals",
            }}
            // FIXME:
            status="In progress"
            created={data.timestamp}
            proposer={data.args[1]}
          />

          <Card
            title="Support progress"
            action={
              authed
                ? uni != 0
                  ? {
                      name: "Delegate Votes",
                      handler: () => console.log("Delegate Votes"),
                    }
                  : {
                      name: "Insufficient Balance",
                      handler: () => console.log("Insufficient Balance"),
                      disabled: true,
                    }
                : {
                    name: "Connect to a wallet",
                    handler: () => unlock(),
                  }
            }
          >
            <div className={styles.card__progress}>
              <div className={styles.card__progress_bar}>
                <div style={{ width: "40%" }} />
              </div>
              <div className={styles.card__delegated}>
                <h4>Votes Delegated</h4>
                <h1>
                  <span>3,542,001</span> / 10,000,000
                </h1>
              </div>
              <p>
                This proposal needs 10M votes to progress and can be terminated
                by the author at any time.
              </p>
            </div>
          </Card>

          <Card
            title="Proposal details"
            subtext={`${data.args[4].length} action${
              data.args[4].length === 1 ? "" : "s"
            }`}
          >
            <div className={styles.card__details}>
              <div className={styles.card__details_actions}>
                {data.args[2].map((contract, i) => {
                  return (
                    <div>
                      <span>{i + 1}</span>
                      <p>
                        {contract}.{data.args[4][i]}.{data.args[5][i]}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.card__details_content}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  children={data.args[6].replace(`# ${data.title}`, "")}
                />
              </div>
            </div>
          </Card>

          <Card title={`X Supporters`} subtext="Votes">
            <span>Test child content</span>
          </Card>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

// Run on page load
export async function getServerSideProps({ params: { address } }) {
  // Return retrieved content
  return {
    // As prop
    props: {
      address,
    },
  };
}
