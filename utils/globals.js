import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet } from '@vechain/connex-driver';
import VEXABI from "@utils/abi/vex"; // VEX Governnace Token ABI
import GovernorAlphaABI from "@utils/abi/GovernorAlpha";
import { VEX_NETWORK } from "@utils/constants"; // Constants

// Setup provider at global scope
// Mainly for use in /api/proposals
// Because that is rendered at the backend, not frontend
const net = new SimpleNet("https://testnet.veblocks.net")
const driver = await Driver.connect(net)
const globalProvider = new Framework(driver);

// Setup GovernorAlpha contract at the global scope
const governorAlphaContract = globalProvider.thor.account(VEX_NETWORK.governor_alpha.address);


// Export providers
export {
  globalProvider,
  governorAlphaContract,
};
