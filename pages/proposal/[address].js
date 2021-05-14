import Layout from "@components/Layout"; // Component: Layout
import { useRouter } from "next/router"; // Routing
import governance from "@state/governance"; // Global governance state
import { useState, useEffect } from "react"; // React state management
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import Card from "@components/Card";
import styles from "@styles/pages/Proposal.module.scss";
import eth from "@state/eth";
import {
  collectNameByContract,
  generateActionSignatureHTML,
} from "@utils/constants";
import Markdown from "markdown-to-jsx";

export default function Proposal({ address }) {
  // Routing
  const router = useRouter();

  // Global state
  const { address: authed, unlock } = eth.useContainer();
  const {
    uni,
    collectProposalByContract,
    delegateToContract,
    proposeContract,
  } = governance.useContainer();

  // Local state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

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

  const delegateWithLoading = async () => {
    setButtonLoading(true);

    try {
      await delegateToContract(data.args[0]);
      setData([...(await collectProposalByContract(address))]);
    } catch {
      console.log("Error when delegating to contract");
    }

    setButtonLoading(false);
  };

  const proposeWithLoading = async () => {
    setButtonLoading(true);

    try {
      await proposeWithLoading(data.args[0]);
      setData([...(await collectProposalByContract(address))]);
    } catch {
      console.log("Error when proposing contract");
    }

    setButtonLoading(false);
  };

  const supportActions = () => {
    let actions = {};

    if (data.status !== "Terminated") {
      if (authed) {
        if (uni != 0) {
          if (data.status === "In Progress") {
            // Check if loading delegation status
            actions.name = "Delegate Votes";
            actions.handler = () => delegateWithLoading();
            actions.loading = buttonLoading;
            actions.loadingText = "Delegating Votes...";
          } else {
            action.name = "Submit Proposal";
            actions.handler = () => proposeWithLoading();
            actions.loading = buttonLoading;
            actions.loadingText = "Submitting Proposal...";
          }
        } else {
          actions.name = "Insufficient Balance";
          actions.handler = () => null;
          disabled = true;
        }
      } else {
        actions.name = "Connect to a wallet";
        actions.handler = () => unlock();
      }
    }

    return actions;
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
            status={data.status}
            created={data.timestamp}
            proposer={data.args[1]}
          />

          <Card title="Support progress" action={supportActions()}>
            <div className={styles.card__progress}>
              <div className={styles.card__progress_bar}>
                <div
                  style={{ width: `${parseFloat(data.votes) / 10000000}%` }}
                />
              </div>
              <div className={styles.card__delegated}>
                <h4>Votes Delegated</h4>
                <h1>
                  <span>{data.votes}</span> / 10,000,000
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
                  const name = collectNameByContract(contract);
                  const signatureElements = generateActionSignatureHTML(
                    data.args[4][i],
                    data.args[5][i]
                  );

                  return (
                    <div>
                      <span>{i + 1}</span>
                      <p>
                        <a
                          href={`https://etherscan.io/address/${contract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {name}
                        </a>
                        .{signatureElements.map((element) => element)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className={styles.card__details_content}>
                {data.args[6].replace(`# ${data.title}`, "") !== "" ? (
                  <Markdown>
                    {data.args[6]
                      .replace(`# ${data.title}`, "")
                      .replace(/\n/g, "<br>")}
                  </Markdown>
                ) : (
                  <p>No description provided.</p>
                )}
              </div>
            </div>
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
