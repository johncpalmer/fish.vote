import { setState, useState, useEffect } from "react"; // Local state management
import { createContainer } from "unstated-next"; // Global state provider
import assert from 'assert';

function useVechain() {
  const [address, setAddress] = useState(null); // User address
  const [provider, setProvider] = useState(null); // Vechain provider

  /**
   * Unlock wallet, store vechain provider and address
   * Sets address to null if wallet already connected
   */
  const unlock = async () => {

    // If already connected to wallet
    if (address && provider) {
      setAddress(null);
      console.log(provider.vendor);
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
        setAddress(annex.signer);
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
    const connex = new Connex({ 
                            node: 'https://testnet.veblocks.net',
                            network: 'test'
                           })
    setProvider(connex);
  }, []);

  return {
    provider,
    address,
    unlock,
  };
}

// Create unstated-next container
const vechain = createContainer(useVechain);
export default vechain;
