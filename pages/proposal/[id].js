import {
  collectNameByContract,
  generateActionSignatureHTML,
} from "@utils/constants"; // Parsing functions
import vechain from "@state/vechain"; // Global state: vechain
import gfm from "remark-gfm"; // Markdown: GitHub formatting
import Head from "next/head"; // SSR Meta
import Card from "@components/Card"; // Component: Card
import Modal from "@components/Modal"; // Component: Modal
import Layout from "@components/Layout"; // Component: Layout
import { useRouter } from "next/router"; // Routing
import ReactMarkdown from "react-markdown"; // React Markdown
import governance from "@state/governance"; // Global governance state
import { useState, useEffect } from "react"; // React state management
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import { collectProposals } from "pages/api/proposals"; // Server-side collection function
import styles from "@styles/pages/Proposal.module.scss"; // Component styles

export default function Proposal({ id, defaultProposalData }) {
  // Routing
  const router = useRouter();

  // Global state
  const {
    currentVotes,
    proposals,
    getReceipt,
    collectProposalById,
    castVote,
    queueProposal
  } = governance.useContainer();
  const { address: authed, unlock } = vechain.useContainer();

  // Local state
  const [data, setData] = useState(JSON.parse(defaultProposalData));
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [voteFor, setVoteFor] = useState(true);
  const [receipt, setReceipt] = useState(null);

  /**
   * Fetch proposal details
   */
  const fetchProposal = async () => {
    // Collect proposal from global state (or pull if no proposals exist)
    const proposal = await collectProposalById(id);

    // If proposal does not exist
    if (!proposal.success) {
      // Return to "/"
      await router.push("/");
    }

    // Else, toggle loading and update data
    setData(proposal.data);
  };

  const fetchReceipt = async () => {
    if (authed) {
      const receipt = await getReceipt(data.id);
      setReceipt(receipt);
    }
  }

  /**
   * Casts the vote on GovernorAlpha 
   * on the blockchain
   */
  const castVoteWithLoading = async () => {
    setButtonLoading(true); // Toggle loading

    try {
      // Call delegation with contract
      await castVote(data.id, voteFor);
      // Close modal if open
      setModalOpen(false);
    } catch (error) {
      console.error("Error when voting", error);
    }
    await fetchProposal();
    setButtonLoading(false); // Toggle loading
  };

  /**
   * Queues the contract for later execution
   * Only applies to contract in the succeeded state
   */ 
  const queueWithLoading = async () => {
    setButtonLoading(true);
    try {
      await queueProposal(id);
    } catch (error) {
      console.error("Error when queuing", error);
    }
    setButtonLoading(false);
  };
  
  /**
   * Queues the contract for later execution
   * Only applies to contract in the succeeded state
   */ 
  const executeWithLoading = async () => {

  };

  /**
   * Support action button rendering
   * @returns {Object[]?} containing button name, handler, loading?, loadingText?
   */
  const supportActions = () => {
    // Setup button object
    let actions = {};

    // If proposal is active
    if (data.state === "Active") {
      // Check for authentication
      if (authed) {
        // If user has effective votes
        if (currentVotes > 0) {
          // If user hasn't already voted
          if (receipt) {
            if (!receipt.hasVoted) {
              // Enable votes (open modal)
              actions.name = "Cast Votes";
              actions.handler = () => setModalOpen(true);
            }
            // Case of already voted
            else {
              const supportText = receipt.support ? "For" : "Against";
              actions.name = "Votes Cast " + supportText;
              actions.handler = () => null;
              actions.disabled = true;
            }
          }
          // Receipt still loading
          else {
            actions.text = "Loading";
            actions.loadingText = "Loading";
            actions.disabled = true;
            actions.loading = true;
            actions.handler = () => null;
          }
        } 
        else {
          // Else, present insufficient balance
          actions.name = "Insufficient Balance";
          actions.handler = () => null;
          actions.disabled = true;
        }        
      }
      else {
        // If not authenticated, prompt for connecting
        actions.name = "Connect wallet";
        actions.handler = () => unlock();
      }
    }
    // If proposal is in a succeeded state
    else if (data.state === "Succeeded") {
      if (authed) {
        actions.name = "Queue Proposal";
        actions.handler = () => queueWithLoading();
        actions.disabled = false;
      }
      else {
        actions.name = "Connect wallet";
        actions.handler = () => unlock();
      }
    }  
    // If proposal is in a queued state
    else if (data.state === "Queued") {
      if (authed) {
        // TODO: Check if eta has arrived
        // actions.name = "Execute Proposal";
        // actions.handler = () => executeWithLoading();
        // actions.disabled = false;
        
        // If not, show that not yet ETA and disable action
        // actions.name = "Not yet ETA";
        // actions.handler = () => null;
        // actions.disabled = true;
      }
      else {
        actions.name = "Connect wallet";
        actions.handler = () => unlock();
      }
    }
    // Else if proposal is in a state where 
    // there is nothing to do
    else if (data.state === "Pending" || 
             data.state === "Canceled" ||
             data.state === "Defeated" || 
             data.state === "Executed" || 
             data.state === "Expired") {
      // Update the button
      actions.name = "Proposal " + data.state;
      actions.handler = () => null;
      actions.disabled = true;
      actions.customColor = "#4DB858";
    }

    // Return buttons object
    return actions;  
  };

  /**
   * Returns (pink || green) depending on state of proposal
   * @returns {String} color
   */
  const getColorByState = () => {
    switch(data.state) {
      case "Pending":
      case "Active":
        return "#4DB858";
      case "Canceled":
      case "Defeated": 
      case "Succeeded": 
      case "Queued": 
      case "Expired": 
      case "Executed":
        return "var(--color-orange)";
      default:
        console.error("Unrecognized proposal state");
    }
  };

  // Fetch proposal on page load (and proposals array change)
  useEffect(fetchProposal, [proposals]);

  // Fetch the vote receipt when user is authenticated
  useEffect(fetchReceipt, [authed]);

  return (
    // Pass proposal prop to prevent title/meta overlap
    <Layout proposal={true}>
      {/* Page custom meta */}
      <Head>
        {/* Update page title for proposals */}
        <title>Fish.vote | {data.title}</title>
        <meta property="og:title" content={`Fish.vote | ${data.title}`} />
        <meta property="twitter:title" content={`Fish.vote | ${data.title}`} />
      </Head>

      {/* Delegation modal (hidden when !modalOpen) */}
      <Modal open={modalOpen} openHandler={setModalOpen}>
        <div className={styles.card__delegate_modal}>
          <h3>Confirm Voting</h3>
          <p>
            You are voting with your <span>{parseFloat(currentVotes).toLocaleString("us-en", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })} 
            {" "}Votes</span> to this proposal.
            Don't worry, you'll retain all the votes that have been delegated to
            you by other token holders. You can change your mind and delegate
            votes back to yourself at any time on{" "}
            <a
              href="https://sybil.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              sybil.org
            </a>
            .
          </p>
          <div>
            <input type="radio" value="For" checked={voteFor} onChange={() => setVoteFor(true)}/> For
            <input type="radio" value="Against" checked={!voteFor} onChange={() => setVoteFor(false)}/> Against
          </div>
          {/* Cast votes button */}
          <button
            onClick={() => castVoteWithLoading()}
            disabled={buttonLoading}
          >
            {buttonLoading ? "Casting votes..." : "Cast votes"}
          </button>
        </div>
      </Modal>

      {/* Page title breadcrumb */}
      <Breadcrumb
        title={data.title}
        lastRoute={{
          path: "/",
          name: "Home",
        }}
        state={data.state}
        created={data.timestamp}
        proposer={data.proposer}
      />

      {/* Support progress card */}
      <Card title="Support progress" action={supportActions()}>
        <div className={styles.card__progress}>
          {/* Render status bar based on vote count */}
          <div className={styles.card__progress_bar}>
            <div
              style={{
                width:
                  // If proposal is proposed
                  data.state === "Proposed"
                    ? // Force 100% bar
                      "100"
                    : // If number of votes > 0 && < 100k
                    parseFloat(data.votes) >= 0 &&
                      parseFloat(data.votes) < 100000
                    ? // Show 1%
                      "1%"
                    : // Else, show accurate value
                      `${Math.min(
                        (parseFloat(data.votes) / 10000000) * 100,
                        // Maximum fill: 100%
                        100
                      )}%`,
                backgroundColor: getColorByState(),
              }}
            />
          </div>

          {/* Vote cast count */}
          <div className={styles.card__delegated}>
            <h4>Votes Cast</h4>
            <h1>
              <span style={{ color: getColorByState() }}>
                For: {parseFloat(data.votesFor).toLocaleString("us-en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>{"     "}
              <span style={{ color: getColorByState() }}>
                Against: {parseFloat(data.votesAgainst).toLocaleString("us-en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </h1>
          </div>
          <h2>
            <span style={{ color: getColorByState() }}>
                Total: {parseFloat(data.votesAgainst + data.votesFor).toLocaleString("us-en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
          </h2>
        </div>
      </Card>

      {/* Proposal details */}
      <Card
        title="Proposal details"
        subtext={`${data.signatures.length} action${
          // Render (s) if > 1 action
          data.signatures.length === 1 ? "" : "s"
        }`}
      >
        <div className={styles.card__details}>
          {/* Render governance actions */}
          <div className={styles.card__details_actions}>
            {data.targets.map((contract, i) => {
              // For each contract in proposal
              // Collect contract name
              const name = collectNameByContract(contract);
              // Collect signature data
              const signatureElements = generateActionSignatureHTML(
                data.signatures[i],
                data.calldatas[i]
              );

              return (
                <div key={i}>
                  {/* Action number */}
                  <span>{i + 1}</span>

                  {/* Action details */}
                  <p>
                    {/* Action contract */}
                    <a
                      href={`https://explore.vechain.org/accounts/${contract}`}
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

          {/* Proposal description */}
          <div className={styles.card__details_content}>
            {data.description.replace(`# ${data.title}`, "") !== "" ? (
              // Render if markdown exists beyond header (thus, description)
              <ReactMarkdown remarkPlugins={[gfm]} linkTarget="_blank">
                {data.description
                  // Remove markdown for header
                  .replace(`# ${data.title}`, "")
                  // Filter out new lines for description seperator
                  .replace(/\n/g, "\n")}
              </ReactMarkdown>
            ) : (
              // If no description:
              <p>No description provided.</p>
            )}
          </div>
        </div>
      </Card>
    </Layout>
  );
}

// Run on page load
export async function getServerSideProps({ params: { id } }) {
  // Collect all proposals
  const allProposals = await collectProposals();
  // Collect contract addresses
  const allProposalIds = allProposals.map(
    (proposal) => proposal.id
  );

  // If contract does not exist
  if (!allProposalIds.includes(id)) {
    // Force redirect to home
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  // Else, return retrieved content
  return {
    // As prop
    props: {
      id,
      defaultProposalData: JSON.stringify(
        // Stringify data to bypass prop limitation
        allProposals.filter((proposal) => proposal.id === id)[0]
      ),
    },
  };
}
