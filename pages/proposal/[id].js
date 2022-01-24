import React, { useState, useEffect } from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import { useRouter } from "next/router";
import { uniqueId } from "lodash";
import { toast } from 'react-toastify';

import vechain from "@state/vechain";
import governance from "@state/governance";

import { collectNameByContract, generateActionSignatureHTML } from "@utils/constants";

import { collectProposals } from "pages/api/proposals";

import Actions from "@components/Actions";
import AddressLink from "@components/AddressLink";
import Breadcrumb from "@components/Breadcrumb";
import Button from "@components/Button";
import Card from "@components/Card";
import Layout from "@components/Layout";
import Modal from "@components/Modal";
import ProgressBar from "@components/ProgressBar";
import VoteCast from "@components/VoteCast";
import VoteInput from "@components/VoteInput";
import { Content } from "@components/Card/styled";
import Loader from "@components/Loader";


import SuccessToast from "@components/SuccessToast";
import PendingToast from "@components/PendingToast";

const Proposal = ({ id, defaultProposalData }) => {
  // Routing
  const router = useRouter();

  // Global state
  const {
    currentVotes,
    proposals,
    getReceipt,
    collectProposalById,
    castVote,
    queueProposal,
    executeProposal,
    getEta,
    collectVotesAtBlock
  } = governance.useContainer();
  const { address: authed, unlock } = vechain.useContainer();

  // Local state
  const [data, setData] = useState(JSON.parse(defaultProposalData));
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [voteFor, setVoteFor] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [eta, setEta] = useState(null)
  const [votesForProposal, setVotesForProposal] = useState(null)

  /**
   * Fetch proposal details
   */
  const fetchProposal = async () => {
    const proposal = await collectProposalById(id);

    if (!proposal.success) {
      await router.push("/");
    }

    setData(proposal.data);
    if (proposal.data.state === "Queued") {
      setEta(await getEta(data.id))
    }
  };

  const fetchReceipt = async () => {
    if (authed) {
      const receipt = await getReceipt(data.id);
      setReceipt(receipt);
    }
  }

  const fetchVotes = async () => {
    if (authed && data) {
      const votes = await collectVotesAtBlock(data.startBlock);
      setVotesForProposal(votes);
    }
  }

  /**
   * Casts the vote on GovernorAlpha
   * on the blockchain
   */
  const castVoteWithLoading = async () => {
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
   * Executes the contract
   * Only applies to contract in the queued state and ETA passed
   */
  const executeWithLoading = async () => {
    setButtonLoading(true);
    try {
      await executeProposal(id);
    } catch (error) {
      console.error("Error when executing", error);
    }
    setButtonLoading(false);
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
        if (receipt && votesForProposal !== null) {
          // If user has effective votes
          if (votesForProposal > 0) {
            // If user hasn't already voted
            if (!receipt.hasVoted) {
              // Enable votes (open modal)
              actions.name = "Cast Votes";
              actions.handler = () => setModalOpen(true);
            }
            // Case of already voted
            else {
              const supportText = receipt.support ? "For" : "Against";
              actions.name = "You Voted " + supportText;
              actions.handler = () => null;
              actions.disabled = true;
            }
          }
          else {
            // Else, present insufficient balance
            actions.name = "Insufficient Balance";
            actions.handler = () => null;
            actions.disabled = true;
            actions.tooltipText = `You had insufficient votes when the proposal was created.`
          }
        }   
        // Receipt and votes still loading
        else {
          actions.text = "Loading";
          actions.loadingText = "Loading";
          actions.disabled = true;
          actions.loading = true;
          actions.handler = () => null;
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
      if (authed && eta) {
        //ETA has arrived, execute proposal possible
        if (+eta * 1000 < Date.now()) {
          actions.name = "Execute Proposal";
          actions.handler = () => executeWithLoading();
          actions.disabled = false;
        }
        else {
        //ETA not yet, disable action
          const waitHours = Math.ceil((+eta * 1000 - Date.now()) / 3600000)
          actions.name = "Timelock Pending";
          actions.handler = () => null;
          actions.disabled = true;
          actions.tooltipText = `Proposal can be executed in ${waitHours} hours`
        }
      }
      else {
        actions.name = "Connect wallet";
        actions.handler = () => unlock();
      }
    }

    else if (
      data.state === 'Defeated' ||
      data.state === 'Pending'
    ) {
      actions = {
        name: `Proposal ${data.state}`,
        handler: () => null,
        disabled: true,
        color: '#ff385c',
        background: "#2D0D16",
      }
    }

    else if (data.state === 'Executed') {
      actions = {
        name: `Proposal ${data.state}`,
        handler: () => null,
        disabled: true,
        color: '#37C9AC',
        background: "#1A2628",
      }
    }

    // Else if proposal is in a state where
    // there is nothing to do
    else if (data.state === "Canceled" || data.state === "Expired") {
      // Update the button
      actions = {
        name: `Proposal ${data.state}`,
        handler: () => null,
        disabled: true,
        color: '#fc0a54',
        background: "#2D0D16",
      }
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
        return "#37C9AC";
      case "Canceled":
      case "Defeated":
        return "rgb(255, 56, 92)";
      case "Succeeded":
      case "Queued":
      case "Expired":
        return "#37C9AC";
      case "Executed":
        return "white";
      default:
        console.error("Unrecognized proposal state");
    }
  };

  useEffect(fetchProposal, [proposals]);
  useEffect(fetchReceipt, [authed]);
  useEffect(fetchVotes, [authed, data])

  return (
    // Pass proposal prop to prevent title/meta overlap
    <Layout proposal={true}>
      {/* Page custom meta */}
      <Head>
        {/* Update page title for proposals */}
        <title>Vote.vexchange | {data.title}</title>
        <meta property="og:title" content={`Vote.vexchange | ${data.title}`} />
        <meta property="twitter:title" content={`Vote.vexchange | ${data.title}`} />
      </Head>

      <Modal open={modalOpen} openHandler={setModalOpen}>
        <>
          {buttonLoading ? (
            <Loader />
          ) : (
            <>
              <h3>Confirm Voting</h3>
              <p>
                You are voting with your <span>{parseFloat(votesForProposal).toLocaleString("us-en", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                {" "}votes</span> to this proposal.
                Don't worry, you'll retain all the votes that have been delegated to
                you by other token holders.
              </p>

              <VoteInput onChange={setVoteFor} voteFor={voteFor} />

              <Button
                onClick={() => castVoteWithLoading()}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Casting votes..." : "Cast votes"}
              </Button>
            </>
          )}
        </>
      </Modal>

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

      <Card title="Support progress" action={supportActions()}>
        <ProgressBar
          color={getColorByState()}
          votesAgainst={data.votesAgainst}
          votesFor={data.votesFor}
        />

        <VoteCast
          color={getColorByState()}
          votesAgainst={data.votesAgainst}
          votesFor={data.votesFor}
        />
      </Card>

      {/* Proposal details */}
      <Card
        noPadding
        title="Proposal details"
        subtitle={`${data.signatures.length} action${
          // Render (s) if > 1 action
          data.signatures.length === 1 ? "" : "s"
        }`}
      >
        <div>
          {/* Render governance actions */}
          <Actions>
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
                <div key={uniqueId('proposal_')}>
                  <span>{i + 1}:</span>
                  <p>
                    <AddressLink address={contract} text={name} />
                    .{signatureElements.map((element) => (
                      <React.Fragment key={uniqueId('element_')}>
                        { element }
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              );
            })}
          </Actions>

          {/* Proposal description */}
          <Content>
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
          </Content>
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

export default Proposal;
