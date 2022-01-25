import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from '@emotion/styled'

import vechain from "@state/vechain";
import governance from "@state/governance";

import AddressLink from "@components/AddressLink";
import Button from "@components/Button";
import Card from "@components/Card";
import Empty from "@components/Empty";
import HomeProposalLink from "@components/HomeProposalLink";
import Input from "@components/Input";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";

const ChangeDelegate = styled.div`
  padding-bottom: ${ props => props.inputVisible ? '24px' : '0' };
`

export default function Home() {
  const router = useRouter();

  // Global state
  const { address, unlock } = vechain.useContainer();
  const { proposals, loadingProposals, delegate, delegateToAddress, currentVotes } = governance.useContainer();

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
        return "#f5a788";

      case "Active":
        return "#37C9AC";

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
   * Filter proposals that are in the Pending, Active, Succeeded, or Queued state
   * @param {Object[]} proposals list
   * @returns {Object[]} of proposals that are in those 4 states
   */
  const filterOngoingProposals = (proposals) => {
    // Filter array for object
    const voteFilter = proposals.filter(
      // Where votes value >= 400
      (proposal) =>
          proposal.state === "Pending" ||
          proposal.state === "Active" ||
          proposal.state === "Succeeded" ||
          proposal.state === "Queued"
    );

    // Return array sorted by descending id
    return voteFilter.sort((a, b) =>
      parseInt(a.id) < parseInt(b.id) ? 1 : -1
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

      <Card
        shortMargin
        title="Vexchange Governance"
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
              <ChangeDelegate inputVisible={inputVisible}>
                <p>
                  Current delegate:
                  {" "}
                  <AddressLink address={delegate} />
                </p>
                <Button onClick={openDelegateInput}>Change Delegate</Button>
              </ChangeDelegate>
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
              placeholder="0x0000000000000000000000000000000000000000" />
            <Button onClick={e => handleDelegate('delegate', e)}>Delegate</Button>
          </>
        ) : null}
      </Card>

      {/* Show all ongoing proposals */}
      <Card
        noPadding
        title="Ongoing proposals"
        action={{ name: "Create Proposal", handler: routeToCreate }}
      >
        {loadingProposals ? (
          <Loader />
        ) : filterOngoingProposals(proposals).length < 1 ? (
          <Empty
            content="The home page only shows relevant proposals which are in the Pending, Active, Succeeded, or Queued state."
            link={(
              <Link href="/all">
                <a>{"Read all proposals ->"}</a>
              </Link>
            )}
          />

        ) : (
          <div>
            {filterOngoingProposals(proposals).map((proposal, i) => (
              <HomeProposalLink proposal={proposal} key={i} />
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}
