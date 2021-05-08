import eth from "@state/eth"; // Chain state container
import { ethers } from "ethers"; // Ethers
import UNIABI from "@utils/abi/uni"; // UNI governance token abi
import { useState, useEffect } from "react"; // Local state management
import { UNI_NETWORK } from "@utils/constants"; // Constants
import { createContainer } from "unstated-next"; // Global state provider

function useGovernance() {
  // Global state
  const { address, provider } = eth.useContainer();

  // Contract state
  const [contractUNI, setContractUNI] = useState(null);

  // Governance state
  const [uni, setUni] = useState(null);

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
    await setContractUNI(contractUNI);

    // Collect raw balance
    const balanceRaw = await contractUNI.balanceOf(address);
    // Format balance to readable format
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw));
    // Update balance in state
    setUni(balance);
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
  };
}

// Create unstated-next container
const governance = createContainer(useGovernance);
export default governance;
