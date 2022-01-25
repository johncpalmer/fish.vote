import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet } from '@vechain/connex-driver';
import { VEX_NETWORK } from "@utils/constants"; // Constants

// Setup provider at global scope
// Mainly for use in /api/proposals
// Because that is rendered at the backend, not frontend
const net = new SimpleNet(VEX_NETWORK.node_url)
const driver = await Driver.connect(net)
const globalProvider = new Framework(driver);

// Setup GovernorAlpha contract at the global scope
const governorAlphaContract = globalProvider.thor.account(VEX_NETWORK.governor_alpha.address);

// Export providers
export {
  globalProvider,
  governorAlphaContract,
};
