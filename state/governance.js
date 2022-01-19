import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { find } from 'lodash';
import { ethers } from "ethers";
import { createContainer } from "unstated-next";

import vechain from "@state/vechain";
import VEXABI from "@utils/abi/vex";
import { VEX_NETWORK } from "@utils/constants";
import GovernorAlphaABI from "@utils/abi/GovernorAlpha";

import ErrorToast from "@components/ErrorToast";
import SuccessToast from "@components/SuccessToast";
import PendingToast from "@components/PendingToast";
import { waitForNumBlocks } from "@utils/functions";

function useGovernance() {
  // Global state
  const { address, provider } = vechain.useContainer();

  // Contract state
  const [vexContract, setVexContract] = useState(null);
  const [governanceContract, setGovernanceContract] = useState(null);

  // Governance state
  const [vex, setVex] = useState(null);
  const [currentVotes, setCurrentVotes] = useState(null);
  const [delegate, setDelegate] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [loadingProposals, setLoadingProposals] = useState(true);

  /**
   * Collect user details
   */
  const collectUser = () => {
    collectVexBalance();
    collectDelegates();
    collectCurrentVotes();
  };

  /**
   * Collect VEX balance and updates in state
   */
  const collectVexBalance = async () => {
    // Collect raw balance
    const balanceOfABI = find(VEXABI, { name: "balanceOf" });
    const method = vexContract.method(balanceOfABI);
    const balanceRaw = (await method.call(address)).data;

    // Format balance to readable format
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw));
    // Update balance in state
    setVex(balance);
  };

  /**
   * Collect current effective votes of the user and updates in state
   */
  const collectCurrentVotes = async () => {
    const currentVotesABI = find(VEXABI, { name: "getCurrentVotes"});
    const method = vexContract.method(currentVotesABI);
    const currentVotesRaw = (await method.call(address)).data;

    const currentVotes = parseFloat(ethers.utils.formatEther(currentVotesRaw));

    setCurrentVotes(currentVotes);
  }

  /**
   * Collect delegates of the user updates in state
   */
  const collectDelegates = async () => {
    // Collect delegate
    const delegatesABI = find(VEXABI, { name: "delegates" });
    const method = vexContract.method(delegatesABI);
    const delegate = (await method.call(address)).decoded[0];

    // Update delegate in state
    setDelegate(delegate);
  }

  /**
   * Obtains the vote receipt of the user for the proposalId
   * @param {string} proposalId of the proposal of interest
   * @returns {Receipt} an object as defined in GovernorAlpha
   */
  const getReceipt = async (proposalId) => {
    const getReceiptABI = find(GovernorAlphaABI, { name: "getReceipt" });
    const method = governanceContract.method(getReceiptABI);
    const receipt = (await method.call(proposalId, address)).decoded[0];

    return receipt;
  }

  /**
   * Obtains the eta for a proposal after it was queued
   * @param {string} proposalId of the proposal of interest
   * @returns {eta}
   */
  const getEta = async (proposalId) => {
    // Filter for all ProposalQueued events
    if (governanceContract === null) return '';

    const proposalQueuedABI = find(GovernorAlphaABI, {name: 'ProposalQueued' });
    const proposalQueuedEvent = governanceContract.event(proposalQueuedABI);
    const filter = proposalQueuedEvent.filter([{}]);
    const events = await filter.apply(0, 20);
    const eventById = events.find(e => e.decoded.id === proposalId)
    return eventById.decoded.eta;
  }


  /**
   * Delegates to an address
   * @param {String} newDelegate address for CrowdProposal
   */
  const delegateToAddress = async (newDelegate) => {
    if(!ethers.utils.isAddress(newDelegate)) {
      console.error("newDelegate address is not a valid address", newDelegate);
      return;
    }

    // Delegate to specified newDelegate
    const delegateABI = find(VEXABI, { name: 'delegate' });
    const method = vexContract.method(delegateABI);
    const clause = method.asClause(newDelegate);

    const txResponse = await provider.vendor.sign('tx', [clause])
                              .signer(address)
                              .comment("Sign to delegate your votes to " + newDelegate)
                              .request();


    const toastID = toast.loading(<PendingToast tx={txResponse} />);
    const txVisitor = provider.thor.transaction(txResponse.txid);
    let txReceipt = null;
    const ticker = provider.thor.ticker();

    // Wait for tx to be confirmed and mined
    while(!txReceipt) {
      await ticker.next();
      txReceipt = await txVisitor.getReceipt();
    }

    if (!txReceipt.reverted) {
      toast.update(toastID, {
        render: (
          <SuccessToast
            tx={txReceipt}
            action="Delegated"
          />
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    }
    else {
      toast.update(toastID, {
        render: <ErrorToast />,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }

    // Update delegates with new information
    collectDelegates();
    collectCurrentVotes()

    return txReceipt;
  };

  /**
   * Votes for or against concerning a contract
   * @param {String} id proposal id of the contract we're interacting with
   * @param {boolean} voteFor true if voting in agreement, false for disagreement
   */
  const castVote = async (id, voteFor) => {
    // Delegate to contract and wait for 1 confirmation
    const castVoteABI = find(GovernorAlphaABI, { name: 'castVote' })
    const method = governanceContract.method(castVoteABI);
    const clause = method.asClause(id, voteFor);
    const txResponse = await provider.vendor.sign('tx', [clause])
                              .signer(address) // This modifier really necessary?
                              .comment("Sign to cast your vote for Proposal ID " + id)
                              .request();

    const toastID = toast.loading(<PendingToast tx={txResponse} />);
    const txVisitor = provider.thor.transaction(txResponse.txid);
    let txReceipt = null;
    const ticker = provider.thor.ticker();

    // Wait for tx to be confirmed and mined
    while(!txReceipt) {
      await ticker.next();
      txReceipt = await txVisitor.getReceipt();
    }

    await waitForNumBlocks(ticker, 2);

    if (!txReceipt.reverted) {
      toast.update(toastID, {
        render: (
          <SuccessToast
            tx={txReceipt}
            action="Voted"
          />
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    }
    // Handle failed tx
    else {
      toast.update(toastID, {
        render: <ErrorToast />,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }

    // Recollect proposals with updated information
    await collectProposals();
  };


  /**
   * Generates padded bytes based on type and value
   * @param {String} type solidity type
   * @param {String} value matching to solidity type
   * @returns {String} emulating ethers.Bytes
   */
  const generateBytesByType = async (type, value) => {
    switch (type) {
      // If type of value is address:
      case "address":
        // If address is ENS name
        if (!value.startsWith("0x")) {
          value = await provider.resolveName(value);
        }

        // Pad address for 20 bytes and drop 0x
        return ethers.utils.hexZeroPad(value, 32).substring(2);
      // Else if, type of value is uint256
      case "uint256":
        // Format value with appropriate decimals
        const valueDecimals = ethers.utils.parseUnits(
          Number(value).toFixed(18),
          18
        );
        // Convert BigNumber to HexString
        const valueHex = valueDecimals.toHexString();
        // Pad HexString to 32 bytes and drop 0x
        return ethers.utils.hexZeroPad(valueHex, 32).substring(2);
    }
  };

  /**
   * Generates bytes per function
   * @param {String} signature of function
   * @param {String[]} values of function params
   * @returns {String} emulating ethers.Bytes
   */
  const generateBytes = async (signature, values) => {
    // Collect types array from signature
    const typesString = signature.split("(").pop().split(")")[0];
    const typesArray = typesString.split(",");

    // Map over each type
    const bytes = await Promise.all(
      typesArray.map(
        async (type, i) =>
          // Generate bytes by type
          await generateBytesByType(type, values[i])
      )
    );

    // Return bytes
    return "0x".concat(...bytes);
  };

  /**
   * Creates a new CrowdProposal via the CrowdProposalFactory
   * @param {String[]} contracts array of target addresses
   * @param {String[]} functions array of function signatures to be called
   * @param {String[]} funcArgs array of function arguments to fill
   * @param {String[]} values array of function param values to fill
   * @param {String} title of proposal
   * @param {String} description of proposal
   * @returns {String} created proposal address
   */
  const createProposal = async (
    contracts,
    functions,
    funcArgs,
    values,
    title,
    description
  ) => {
    // Generate post markdown
    const postMarkdown = `# ${title}

    ${description}`;

    // Generate raw calldata
    const calldataRaw = funcArgs.map((target, i) =>
      // By zipping target and values arrays if they exist
      typeof values[i] !== "undefined" ? [...target, ...values[i]] : [...target]
    );
    // Convert stringified calldata to bytes
    const calldataBytes = await Promise.all(
      functions.map(
        async (func, i) =>
          // By generating bytes for each individual function signature and param values
          await generateBytes(func, calldataRaw[i])
      )
    );
    // Create a new proposal
    const proposeABI = find(GovernorAlphaABI, { name: "propose" });
    const proposeMethod = governanceContract.method(proposeABI);

    const valuesPlaceholder = new Array(contracts.length).fill(0);

    // TODO: need to convert values[] into number/Bignumber types
    // fish.vote did this too because they did not have any functions that
    // Required a transfer of value (i.e. VET)
    // Connex complains that values are not of the correct type
    // Using a placeholder for now
    const clause = proposeMethod.asClause(
      contracts,
      valuesPlaceholder,
      //values,
      functions,
      calldataBytes,
      postMarkdown
    );

    const txResponse = await provider.vendor.sign('tx', [clause])
                                  .signer(address) // This modifier really necessary?
                                  .comment("Sign to submit Proposal to GovernorAlpha")
                                  .request();

    const toastID = toast.loading(<PendingToast tx={txResponse} />);
    const txVisitor = provider.thor.transaction(txResponse.txid);
    let txReceipt = null;
    // ticker object to track the creation of blocks on chain
    const ticker = provider.thor.ticker();

    // Wait for tx to be confirmed and mined
    while(!txReceipt) {
      await ticker.next();
      txReceipt = await txVisitor.getReceipt();
    }

    // Handle failed tx
    if (!txReceipt.reverted) {
      toast.update(toastID, {
        render: (
          <SuccessToast
            tx={txReceipt}
            action="Proposed"
          />
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    } else {
      toast.update(toastID, {
        render: <ErrorToast />,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }

    const proposalId = parseInt(txReceipt.outputs[0].events[0].data.substring(0,66));

    // Regenerate proposals
    await collectProposals();

    // Return proposal id
    return proposalId;
  };

  /**
   * Queues proposals in the Successful state for execution
   * after timelock delay (currently 2 days)
   * @param proposalId
   */
  const queueProposal = async (proposalId) => {
    if (!proposalId) {
      console.error("proposalId should not be null");
      return;
    }

    const queueABI = find(GovernorAlphaABI, { name: "queue" });
    const method = governanceContract.method(queueABI);
    const clause = method.asClause(proposalId);
    const txResponse = await provider.vendor.sign('tx', [clause])
                              .signer(address) // This modifier really necessary?
                              .comment("Sign to queue proposal " + proposalId)
                              .request();

    const toastID = toast.loading(<PendingToast tx={txResponse} />);

    const txVisitor = provider.thor.transaction(txResponse.txid);
    let txReceipt = null;
    const ticker = provider.thor.ticker();

    // Wait for tx to be confirmed and mined
    while(!txReceipt) {
      await ticker.next();
      txReceipt = await txVisitor.getReceipt();
    }

    if (!txReceipt.reverted) {
      toast.update(toastID, {
        render: (
            <SuccessToast
                tx={txReceipt}
                action="Proposal Queued"
            />
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    }
    else {
      toast.update(toastID, {
        render: <ErrorToast />,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }

    // Regenerate proposals
    await collectProposals();
  }

  const executeProposal = async (proposalId) => {
    if (!proposalId) {
      console.error("proposalId should not be null");
      return;
    }

    const executeABI = find(GovernorAlphaABI, { name: "execute" });
    const method = governanceContract.method(executeABI);
    const clause = method.asClause(proposalId);
    const txResponse = await provider.vendor.sign('tx', [clause])
                              .signer(address) // This modifier really necessary?
                              .comment("Sign to execute proposal " + proposalId)
                              .request();
    const toastID = toast.loading(<PendingToast tx={txResponse} />);

    const txVisitor = provider.thor.transaction(txResponse.txid);
    let txReceipt = null;
    const ticker = provider.thor.ticker();

    // Wait for tx to be confirmed and mined
    while(!txReceipt) {
      await ticker.next();
      txReceipt = await txVisitor.getReceipt();
    }

    if (!txReceipt.reverted) {
      toast.update(toastID, {
        render: (
            <SuccessToast
                tx={txReceipt}
                action="Proposal Executed"
            />
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    }
    else {
      toast.update(toastID, {
        render: <ErrorToast />,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }

    // Regenerate proposals
    await collectProposals();
  }

  const collectProposals = async () => {
    // Toggle loading
    setLoadingProposals(true);

    // Collect proposals
    const response = await axios.get("/api/proposals");
    const data = response.data;

    // Update data
    setProposals(data);
    // Toggle loading
    setLoadingProposals(false);

    // Optional proposals return
    return data;
  };

  /**
   * Collects proposal by id
   * @param {String} id of proposal
   * @returns {Object[]} details of a GovernorAlpha proposal
   */
  const collectProposalById = async (id) => {
    // Setup vars
    let allProposals = proposals;
    let proposalDetails = {
      success: false,
      data: [],
    };

    // If no proposals
    if (!allProposals) {
      // Collect proposals
      allProposals = await collectProposals();
    }

    // Collect all proposal ids
    const allProposalIds = allProposals.map(
      (proposal) => proposal.id
    );
    // If contract exists in all proposals
    if (allProposalIds.includes(id)) {
      // Update proposal details
      proposalDetails.success = true;
      proposalDetails.data = allProposals.filter(
        (proposal) => proposal.id === id
      )[0];
    }

    // Return proposal details
    return proposalDetails;
  };

  /**
   * Sets up contract addresses when provider is available
   */
  const setupGovernance = async () => {
    // If vechain provider is already available
    if (provider) {
      if (!vexContract) {
        // Setup VEX governance token contract
        const contractVEX = provider.thor.account(VEX_NETWORK.vex_governance_token.address);

        // Update VEX contract in global state
        await setVexContract(contractVEX);
      }
      if (!governanceContract) {
        // Setup GovernorAlpha contract
        const contractGov = provider.thor.account(VEX_NETWORK.governor_alpha.address);

        // Update Governor contract in global state
        await setGovernanceContract(contractGov);
      }
    }
  };

  /**
   * Collections of user data to run on load
   */
  const setupUser = () => {
    // If authenticated
    if (address && provider && vexContract) {
      // Run setup functions
      collectUser();
    } else {
      // Else, nullify state
      setVex(null);
    }
  };

  /**
   * Collects proposals on load if they dont exist in-mem
   */
  const collectProposalsOnLoad = async () => {
    if (!proposals) {
      await collectProposals();
    }
  };

  // Setup contract addresses on load
  useEffect(setupGovernance, [provider]);

  // Setup governance parameters on auth
  useEffect(setupUser, [address]);

  useEffect(collectProposalsOnLoad, []);

  return {
    vex,
    governanceContract,
    delegate,
    currentVotes,
    proposals,
    getReceipt,
    getEta,
    loadingProposals,
    createProposal,
    queueProposal,
    executeProposal,
    collectProposalById,
    delegateToAddress,
    castVote,
  };
}

// Create unstated-next container
const governance = createContainer(useGovernance);
export default governance;
