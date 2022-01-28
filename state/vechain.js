import { useState, useEffect } from "react"; // Local state management
import { createContainer } from "unstated-next"; // Global state provider
import { ethers } from 'ethers';
import assert from 'assert';
import { VEX_NETWORK, MAINNET } from "@utils/constants";
import { userAccount } from '../utils';

function useVechain() {
  const [address, setAddress] = useState(null); // User address
  const [vtho, setVTHO] = useState(0); // User address
  const [provider, setProvider] = useState(null); // Vechain provider
  const [ticker, setTicker] = useState(null);
  const [tick, setTick] = useState(null);

  /**
   * Unlock wallet, store vechain provider and address
   * Sets address to null if wallet already connected
   */
  const unlock = async () => {
    // If already connected to wallet
    if (address && provider) {
      setAddress(null);
    }
    else {
      const WALLET_SIGN_MSG = {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Select account to sign onto site'
        }
      }

      assert(provider !== undefined);

      try {
        const sign = provider.vendor.sign('cert', WALLET_SIGN_MSG);
        const { annex } = await sign.request();
        const account = provider.thor.account(annex.signer);
        const { energy: energyAsHex } = await account.get();
        const energy = ethers.BigNumber.from(energyAsHex);

        userAccount.set(annex.signer);
        setAddress(annex.signer);
        setVTHO(energy);
      }
      catch (error) {
        console.error(error);
      }
    }
  };

  // --> Lifecycle: on mount
  useEffect(async () => {
    // Initialize the connex provider
    const { Connex } = await import('@vechain/connex');
    const network = MAINNET ? "main" : "test";
    const connex = new Connex({
                            node: VEX_NETWORK.node_url,
                            network: network
                           })

    const account = userAccount.get();
    if (account) {
      setAddress(account);
    }

    setProvider(connex);
    setTicker(connex.thor.ticker());
  }, []);

  useEffect(async () => {
    if (ticker) {
      let _tick = await ticker.next();
      setTick(_tick);
    }
  }, [ticker, tick]);

  return {
    provider,
    address,
    vtho,
    tick,
    unlock,
  };
}

// Create unstated-next container
const vechain = createContainer(useVechain);
export default vechain;
