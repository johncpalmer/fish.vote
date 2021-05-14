import eth from "@state/eth"; // Chain state container
import { ethers } from "ethers"; // Ethers
import UNIABI from "@utils/abi/uni"; // ABI: UNI Governance Token
import { useState, useEffect } from "react"; // Local state management
import { UNI_NETWORK } from "@utils/constants"; // Constants
import { createContainer } from "unstated-next"; // Global state provider
import CrowdProposalFactoryABI from "@utils/abi/CrowdProposalFactory"; // ABI: CrowdProposalFactory
import axios from "axios";

function useGovernance() {
  // Global state
  const { address, provider } = eth.useContainer();

  // Contract state
  const [uniContract, setUniContract] = useState(null);
  const [proposalFactory, setProposalFactory] = useState(null);

  // Governance state
  const [uni, setUni] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [infiniteAllowance, setInfiniteAllowance] = useState(null);

  /**
   * Collect user details
   */
  const collectUser = async () => {
    // Collect signer from Ethers
    const signer = await provider.getSigner();

    // Setup UNI governance token contract
    const contractUNI = new ethers.Contract(
      UNI_NETWORK.uni_governance_token.address,
      UNIABI,
      signer
    );

    // Setup CrowdProposalFactory contract
    const proposalFactory = new ethers.Contract(
      UNI_NETWORK.crowd_proposal_factory.address,
      CrowdProposalFactoryABI,
      signer
    );

    // Collect balance
    await collectUniBalance(contractUNI);
    // Collect allowance
    await collectInfiniteAllowance(contractUNI);

    // Update contracts in global state
    setUniContract(contractUNI);
    setProposalFactory(proposalFactory);
  };

  /**
   * Collect UNI balance and update in state
   * @param {ethers.Contract} contract UNI token contract
   */
  const collectUniBalance = async (contract) => {
    // Collect raw balance
    const balanceRaw = await contract.balanceOf(address);
    // Format balance to readable format
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw));
    // Update balance in state
    setUni(balance);
  };

  /**
   * Collect if allowance is is infinite or not for token factory and update in state
   * @param {ethers.Contract} contract Token Factory contract
   */
  const collectInfiniteAllowance = async (contract) => {
    // Collect raw allowance
    const allowanceRaw = await contract.allowance(
      address,
      UNI_NETWORK.crowd_proposal_factory.address
    );

    // Check if allowance is infinite (greater than UNI token supply of 1e9 UNI)
    const inifiniteApproved = allowanceRaw.gt(1e9);
    // Update inifinite allowance status in state
    setInfiniteAllowance(inifiniteApproved);
  };

  /**
   * Generates padded bytes based on type and value
   * @param {String} type solidity type
   * @param {String} value matching to solidity type
   * @returns {String} emulating ethers.Bytes
   */
  const generateBytesByType = (type, value) => {
    switch (type) {
      // If type of value is address:
      case "address":
        // Pad address for 20 bytes and drop 0x
        return ethers.utils.hexZeroPad(value, 32).substring(2);
      // Else if, type of value is uint256
      case "uint256":
        // Convert string to BigNumber to HexString
        const valueHex = ethers.BigNumber.from(value).toHexString();
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
  const generateBytes = (signature, values) => {
    // Collect types array from signature
    const typesString = signature.split("(").pop().split(")")[0];
    const typesArray = typesString.split(",");

    // Map over each type
    const bytes = typesArray.map((type, i) =>
      // Generate bytes by type
      generateBytesByType(type, values[i])
    );

    // Return bytes
    return "0x".concat(...bytes);
  };

  /**
   * Creates a new CrowdProposal via the CrowdProposalFactory
   * Must ensure that user has already approved infinite spend for factory
   * @param {String[]} contracts array of target addresses
   * @param {String[]} functions array of function signatures to be called
   * @param {String[]} targets array of target params to fill
   * @param {String[]} values array of function param values to fill
   * @param {String} title of proposal
   * @param {String} description of proposal
   */
  const createProposal = async (
    contracts,
    functions,
    targets,
    values,
    title,
    description
  ) => {
    // Generate post markdown
    const postMarkdown = `# ${title}
    
    ${description}`;

    // Generate raw calldata
    const calldataRaw = targets.map((target, i) =>
      // By zipping target and values arrays if they exist
      typeof values[i] !== "undefined" ? [...target, ...values[i]] : [...target]
    );
    // Convert stringified calldata to bytes
    const calldataBytes = functions.map((func, i) =>
      // By generating bytes for each individual function signature and param values
      generateBytes(func, calldataRaw[i])
    );

    // Create a new proposal
    const tx = await proposalFactory.createCrowdProposal(
      // List of contracts
      contracts,
      // Send 0 value from contract
      new Array(contracts.length).fill("0"),
      // Function signatures
      functions,
      // Call data from values and targets
      calldataBytes,
      // Proposal description
      postMarkdown
    );

    // Wait for 1 confirmation
    await tx.wait(1);
    // Regenerate proposals
    await collectProposals();
    // Collect updated uni balance
    await collectUniBalance();
  };

  /**
   * Infinite approves factory contract
   */
  const inifiniteApproveFactory = async () => {
    // Collect approval transaction
    const tx = await uniContract.approve(
      UNI_NETWORK.crowd_proposal_factory.address,
      // Of infinite approval
      ethers.constants.MaxUint256
    );

    // Wait for 1 confirmation
    await tx.wait(1);
    // Force update allowance status in global state
    await collectInfiniteAllowance(uniContract);
  };

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

  const collectProposalByContract = async (contract) => {
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

    // Collect all proposal contracts
    const allProposalContracts = allProposals.map(
      (proposal) => proposal.contract
    );
    // If contract exists in all proposals
    if (allProposalContracts.includes(contract)) {
      // Update proposal details
      proposalDetails.success = true;
      proposalDetails.data = allProposals.filter(
        (proposal) => proposal.contract === contract
      )[0];
    }

    // Return proposal details
    return proposalDetails;
  };

  const collectProposalsOnLoad = async () => {
    if (!proposals) {
      await collectProposals();
    }
  };

  /**
   * Collections to run on load
   */
  const setupGovernance = async () => {
    // If authenticated
    if (address && provider && provider.provider) {
      // Run setup functions
      collectUser();
    } else {
      // Else, nullify state
      setUni(null);
    }
  };

  // Collect propoposals on load
  useEffect(collectProposalsOnLoad, []);
  // Setup governance parameters on auth
  useEffect(setupGovernance, [address, provider]);

  return {
    uni,
    proposals,
    loadingProposals,
    createProposal,
    collectProposalByContract,
    infiniteAllowance,
    inifiniteApproveFactory,
  };
}

// Create unstated-next container
const governance = createContainer(useGovernance);
export default governance;
