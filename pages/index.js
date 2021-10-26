import { InputWithTopLabel } from "@components/Inputs";
import { ethers } from "ethers";
import Link from "next/link"; // Routing: Links
import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing: Router
import Layout from "@components/Layout"; // Component: Layout
import Switch from "@components/Switch"; // Component: Switch
import Loader from "react-loader-spinner"; // Loaders
import { useState } from "react";
import vechain from "@state/vechain";
import governance from "@state/governance"; // Global state: governance
import styles from "@styles/pages/Home.module.scss"; // Component styles

export default function Home() {
  const router = useRouter(); // Setup router

  // Global state
  const { address } = vechain.useContainer();
  const { proposals, loadingProposals, delegate, currentVotes } = governance.useContainer();

  // Local state 
  const [delegateInput, setDelegateInput] = useState("");

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
        return "black";
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

  return (
    <Layout short>
      {/* Page switch */}
      <center>
        <Switch
          activePath={0}
          firstPath={{ name: "Home", path: "/" }}
          secondPath={{ name: "New", path: "/new" }}
        />
      </center>

      {/* Delegation card */}
      <Card shortMargin
            title="Votes Delegation"
            action={{
              name: "Delegate",
              handler: null
            }}>
        <div className={`card__padding ${styles.home__description}`}>
          <h4>
            Welcome to the governance portal of Vexchange! 
          </h4>
          <p>
            To participate in the governance process of Vexchange, you first need
            to decide if you want to delegate your votes to another address or 
            your own (also known as self-delegating)
          </p>
          {/* If authenticated */}
          {address 
            ?  
            {/* Show delegation details*/}
            [(delegate === ethers.constants.AddressZero 
            
              ? 
                <>
                  <h5>You have not delegated yet</h5>
                  <button>Self-Delegate</button>
                  <button>Delegate to address</button>  
                </>
              : 
                <>
                  <h5>Current delegate: {delegate}</h5>
                  <button>Change Delegate</button>
                </>
              ), 

              <h3>You currently have {currentVotes} votes delegated to you</h3>
             ]
            
            : 
            <p>Connect wallet</p>
          }


          
        {/* 
          <InputWithTopLabel 
            labelTitle="Address to delegate to"
            type="text"
            value={delegateInput}
            onChangeHandler={setDelegateInput}
            placeholder="0x9b8ed0a9......"
          /> */}  
        </div>
      </Card>

      {/* Show all automated proposals */}
      <Card
        title="Top proposals"
        action={{
          name: "Create Proposal",
          handler: routeToCreate,
        }}
      >
        {loadingProposals ? (
          // If proposals are still loading, show spinner
          <div className="card__padding">
            <center>
              <Loader type="Oval" color="#e7347a" height={50} width={50} />
            </center>
          </div>
        ) : // Check if there are no top proposals 
        filterTopProposals(proposals).length < 1 ? (
          // Else if no proposals exist, show empty state
          <div className="card__padding">
            <div className={styles.home__empty}>
              <h3>Nothing here yet</h3>
              <p>
                The home page only shows proposals with 400 votes or more. Once
                there are proposals with more support, they’ll appear here.
              </p>

              {/* Link to new prpoosals page */}
              <Link href="/new">
                <a>{"Read new proposals ->"}</a>
              </Link>
            </div>
          </div>
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
