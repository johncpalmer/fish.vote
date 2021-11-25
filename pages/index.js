import { useState } from "react";
import Loader from "react-loader-spinner";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";

import vechain from "@state/vechain";
import governance from "@state/governance";

import Empty from "@components/Empty";
import Button from "@components/Button";
import Card from "@components/Card";
import Layout from "@components/Layout";
import Switch from "@components/Switch";
import Input from "@components/Input";

import styles from "@styles/pages/Home.module.scss";

export default function Home() {
  const router = useRouter();

  // Global state
  const { address, unlock } = vechain.useContainer();
  const { proposals, loadingProposals,
          delegate, delegateToAddress,
          currentVotes } = governance.useContainer();

  // Local state 
  const [delegateInput, setDelegateInput] = useState("");
  const [inputVisible, setInputVisible] = useState(false);

  /**
   * Routes clicker to /create
   * @param {MouseEvent} e event to track
   */
  const routeToCreate = (e) => {
    e.preventDefault();
    router.push("/create");
  };

  /**
   * Renders state icon color based on state
   * @param {String} state of proposal
   * @returns {String} hex string of color
   */
  const renderStateColor = (state) => {
    switch (state) {
      
      // TODO: to reconsider
      case "Pending":
        return "orange";
      
      case "Active":
        return "#1DB023";

      case "Canceled":
        return "#ff0033";

      case "Succeeded":
        return "#EFC223";

      // TODO: introduce styling for each
      // of the proposal states
      case "Queued":
      case "Expired":
      case "Executed":
      default: 
        return "#FC0B54";
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
   * Filter proposals with greater than or equal to 400 votes
   * @param {Object[]} proposals list
   * @returns {Object[]} of proposals with >= 400 votes
   */
  const filterTopProposals = (proposals) => {
    
    const voteThreshold = 0;

    // Filter array for object
    const voteFilter = proposals.filter(
      // Where votes value >= 400
      (proposal) => parseFloat(proposal.votesFor) >= voteThreshold
    );
    // Return array sorted by votes
    return voteFilter.sort((a, b) =>
      parseFloat(a.votesFor) < parseFloat(b.votesFor) ? 1 : -1
    );
  };

  /**
   * Calls the delegate function with the delegate
   * being the given input address
   * @param {event} event context from which this is fired
   */
  const handleDelegate = async (type, event) => {
    let delegateAddress = null;

    if (type === 'delegate') {
      delegateAddress = delegateInput;
    } else if (type === 'self') {
      delegateAddress = address;
    } else {
      console.error("handleDelegate called with unrecognized event", event);
    }

    try {
      await delegateToAddress(delegateAddress);

      // Close the delegate input
      setInputVisible(false);
    }
    catch (error) {
      console.error("Error during delegation", error);
    }
  };

  const openDelegateInput = async () => {
    setInputVisible(!inputVisible);
  };

  return (
    <Layout short>
      <center>
        <Switch
          activePath={0}
          firstPath={{ name: "Home", path: "/" }}
          secondPath={{ name: "New", path: "/new" }}
        />
      </center>

      <Card
        shortMargin
        title="Vexchange Governance"
        action={{ name: "Delegate", handler: null }}
      >
        <p>Delegate your votes</p>
        <p>
          To participate in the governance process of Vexchange, you first need
          to decide if you want to delegate your votes to another address who will vote
          in the long term interest of Vexchange or if you want to vote on your own (also known as self-delegating).
        </p>
        { address ? (
          <>
            { delegate === ethers.constants.AddressZero ? (
              <>
                <p>You have not delegated yet</p>
                <Button onClick={e => handleDelegate('self', e)}>Self-Delegate</Button>
                <Button onClick={openDelegateInput}>Delegate to address</Button>
              </>
            ) : (
              <>
                <p>Current delegate: {delegate}</p>
                <Button onClick={openDelegateInput}>Change Delegate</Button>
              </>
            )}
          </>
        ) : (
          <Button onClick={unlock}>Connect wallet</Button>
        )}

        { inputVisible ? (
          <>
            <Input
              label="Address to delegate to"
              type="text"
              value={delegateInput}
              onChange={setDelegateInput}
              placeholder="0x9b8ed0a9......" />
            <Button onClick={e => handleDelegate('delegate', e)}>Delegate</Button>
          </>
        ) : null}
      </Card>

      {/* Show all automated proposals */}
      <Card
        noPadding
        title="Top proposals"
        action={{ name: "Create Proposal", handler: routeToCreate, }}
      >
        {loadingProposals ? (
          // If proposals are still loading, show spinner
          <div className="card__padding">
            <center>
              <Loader type="Oval" color="#f5a788" height={50} width={50} />
            </center>
          </div>
        ) : // Check if there are no top proposals 
        filterTopProposals(proposals).length < 1 ? (
          <Empty
            content="The home page only shows proposals with 400 votes or more. Once there are proposals with more support, they’ll appear here."
            link={(
              <Link href="/new">
                <a>{"Read new proposals ->"}</a>
              </Link>
            )}
          />
          
        ) : (
          <div className={styles.home__loading}>
            {filterTopProposals(proposals).map((proposal, i) => {
              // Else if proposals exist
              return (
                // Loop over each proposal and render a proposal link
                <Link href={`/proposal/${proposal.id}`} key={i}>
                  <a className={styles.home__proposal}>
                    {/* Proposal title + vote count */}
                    <div>
                      <h4>{proposal.title}</h4>
                      <span>
                        {proposal.state === "Active"
                          ? "10,000,000+ votes"   /* to refactor this */
                          : formatVoteCount(parseFloat(proposal.votesFor))}
                      </span>
                    </div>

                    {/* Proposal current state */}
                    <div>
                      <div
                        style={{
                          // Render indicator light based on state
                          backgroundColor: renderStateColor(proposal.state),
                        }}
                      />
                      <span>{proposal.state}</span>
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
