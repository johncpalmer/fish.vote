import { ethers } from "ethers"; // Ethers
import Onboard from "bnc-onboard"; // BNC Onboard
import { useState, useEffect } from "react"; // Local state management
import { createContainer } from "unstated-next"; // Global state provider

// Onboarding wallet providers
const wallets = [
  { walletName: "metamask" },
  {
    walletName: "walletConnect",
    infuraKey: process.env.NEXT_PUBLIC_INFURA_RPC,
  },
  {
    walletName: "fortmatic",
    apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY,
  },
  {
    walletName: "portis",
    apiKey: process.env.NEXT_PUBLIC_PORTIS_KEY,
  },
];

function useEth() {
  const [address, setAddress] = useState(null); // User address
  const [onboard, setOnboard] = useState(null); // Onboard provider
  const [provider, setProvider] = useState(null); // Ethers provider

  /**
   * Unlock wallet, store ethers provider and address
   */
  const unlock = async () => {
    // Enables wallet selection via BNC onboard
    await onboard.walletSelect();
    await onboard.walletCheck();
  };

  // --> Lifecycle: on mount
  useEffect(async () => {
    // Onboard provider
    const onboard = Onboard({
      // Ethereum network
      networkId: process.env.NEXT_PUBLIC_UNIFY_MAINNET === "true" ? 1 : 42,
      // Hide Blocknative branding
      hideBranding: true,
      // Setup custom wallets for selection
      walletSelect: {
        heading: "Connect to fish.vote",
        description:
          "Please select a wallet to authenticate with fish.vote to use Uniswap crowd proposals.",
        wallets: wallets,
      },
      // Track subscriptions
      subscriptions: {
        // On wallet update
        wallet: async (wallet) => {
          // If wallet provider exists
          if (wallet.provider) {
            // Collect ethers provider
            const provider = new ethers.providers.Web3Provider(wallet.provider);

            // Collect address
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Collect ENS name
            const ensName = await provider.lookupAddress(address);

            // Update provider and address
            setProvider(provider);
            setAddress(ensName ? ensName : address);
          } else {
            setProvider(null);
            setAddress("");
          }
        },
      },
      // Force connect on walletCheck for WalletConnect
      walletCheck: [{ checkName: "connect" }],
    });

    // Update onboard
    setOnboard(onboard);
  }, []);

  return {
    provider,
    address,
    unlock,
  };
}

// Create unstated-next container
const eth = createContainer(useEth);
export default eth;
