import { ethers } from "ethers"; // Ethers
import Web3Modal from "web3modal"; // Web3Modal
import { useState, useEffect } from "react"; // Local state management
import { createContainer } from "unstated-next"; // Global state provider
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnect

// WalletConnect options for Web3Modal
const providerOptions = {
  // Change network based on environment variable
  network: process.env.NEXT_PUBLIC_UNIFY_MAINNET ? "mainnet" : "kovan",
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Inject Infura RPC ID
      infuraId: process.env.NEXT_PUBLIC_INFURA_RPC,
    },
  },
};

function useEth() {
  const [address, setAddress] = useState(null); // User address
  const [provider, setProvider] = useState(null); // Ethers provider
  const [web3Modal, setWeb3Modal] = useState(null); // Web3 modal

  /**
   * Unlock wallet, store ethers provider and address
   */
  const unlock = async () => {
    // Initiate WalletConnect
    const walletConnectProvider = await web3Modal.connect();
    await walletConnectProvider.enable();

    // Create new Ethers Web3Provider
    const provider = new ethers.providers.Web3Provider(walletConnectProvider);
    const signer = await provider.getSigner();

    // Collect primary account
    const address = await signer.getAddress();

    // Store account, and web3 instance
    setProvider(provider);
    setAddress(address);
  };

  /**
   * Lock wallet, remove ethers instance
   */
  const lock = async () => {
    // If provider is present
    if (provider && provider.provider && provider.provider.close) {
      // Close provider
      await provider.provider.close();
    }

    // Nullify signer instance
    setProvider(null);
    setAddress("");
  };

  /**
   * Setup Web3Modal on page load (requires window)
   */
  const initialSetupWeb3Modal = async () => {
    // Create new web3Modal
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });

    // Set web3Modal globally in context
    setWeb3Modal(web3Modal);
  };

  // Setup eth provider on load
  useEffect(initialSetupWeb3Modal, []);

  return {
    provider,
    address,
    lock,
    unlock,
  };
}

// Create unstated-next container
const eth = createContainer(useEth);
export default eth;
