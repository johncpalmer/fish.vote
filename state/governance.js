import eth from "@state/eth"; // Chain state container
import { ethers } from "ethers"; // Ethers
import UNIABI from "@utils/abi/uni"; // ABI: UNI Governance Token
import { useState, useEffect } from "react"; // Local state management
import { UNI_NETWORK } from "@utils/constants"; // Constants
import { createContainer } from "unstated-next"; // Global state provider
import CrowdProposalFactoryABI from "@utils/abi/CrowdProposalFactory"; // ABI: CrowdProposalFactory

function useGovernance() {
  // Global state
  const { address, provider } = eth.useContainer();

  // Contract state
  const [uniContract, setUniContract] = useState(null);
  const [proposalFactory, setProposalFactory] = useState(null);

  // Governance state
  const [uni, setUni] = useState(null);
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

  const collectUniBalance = async (contract) => {
    // Collect raw balance
    const balanceRaw = await contract.balanceOf(address);
    // Format balance to readable format
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw));
    // Update balance in state
    setUni(balance);
    console.log("Balance: ", balance);
  };

  const collectInfiniteAllowance = async (contract) => {
    // Collect raw allowance
    const allowanceRaw = await contract.allowance(
      address,
      UNI_NETWORK.crowd_proposal_factory.address
    );

    // Check if allowance is infinite (greater than UNI token supply)
    const inifiniteApproved = allowanceRaw.gt(1e9);
    // Update inifinite allowance status in state
    setInfiniteAllowance(inifiniteApproved);
    console.log("Allowance: ", inifiniteApproved);
  };

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

    const calldataRaw = targets.map((target, i) =>
      // Loop over each and zip target and values arrays
      typeof values[i] !== "undefined" ? [...target, ...values[i]] : [...target]
    );
    //const calldataBytes =
    console.log(ethers.utils.hexlify(calldataRaw));

    // Create a new proposal
    /*const tx = proposalFactory.createCrowdProposal(
      // List of contracts
      contracts,
      // Send 0 value from contract
      new Array(contracts.length).fill("0"),
      // Function signatures
      functions,
      // Call data from values and targets
      targets,
      postMarkdown
    );

    // Wait for 1 confirmation
    await tx.wait(1);
    return;*/
  };

  const inifiniteApproveFactory = async () => {
    // Collect approval transaction
    const tx = await uniContract.approve(
      UNI_NETWORK.crowd_proposal_factory.address,
      ethers.constants.MaxUint256
    );

    // Wait for 1 confirmation
    await tx.wait(1);
    // Optimistically update allowance status
    await collectInfiniteAllowance(uniContract);
  };

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

  // Setup governance parameters on auth
  useEffect(setupGovernance, [address, provider]);

  return {
    uni,
    createProposal,
    infiniteAllowance,
    inifiniteApproveFactory,
  };
}

// Create unstated-next container
const governance = createContainer(useGovernance);
export default governance;
