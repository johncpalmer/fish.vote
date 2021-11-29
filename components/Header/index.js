
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import vechain from "@state/vechain";
import governance from "@state/governance";

import Button from '../Button'

import {
  Wrapper,
  Logo,
  Auth,
  AuthConnected,
  AuthConnect,
} from './styled'

const Header = () => {
  // Collect user balance
  const { vex } = governance.useContainer();
  // Collect auth status and functions
  const { address, unlock } = vechain.useContainer();

  // Connect wallet modal
  const [modalOpen, setModalOpen] = useState(false);
  const onOpenModal = () => setModalOpen(true);
  const onCloseModal = () => setModalOpen(false);

  /**
   * Returns VEX balance for authenticated user
   * @returns {String}
   */
  const returnVoteCount = () => {
    // Locale decimals setting (max 2 decimal places)
    const localeDecimals = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };

    // When nil balance immediately show
    if (vex === 0) {
      return "0 VEX";
    }

    // If votes loaded
    return vex
      ? // Return formatted vote count
        `${vex.toLocaleString("us-en", localeDecimals)} VEX`
      : // Else, show loading status
        "Loading...";
  };

  const connectWalletWithLoading = async () => {
      await unlock();

      // Close modal after wallet connection, successful or not
      setModalOpen(false);
  };

  return (
    <Wrapper>
      <Logo>
        <Link href="/">
          <a
            style={{
              display: 'block' 
            }}
          >
            <Image
              src="/vectors/logo-mobile.svg"
              alt="Vexchange logo"
              width={40}
              height={40}
            />
          </a>
        </Link>
      </Logo>

      <Auth>
        {address ? (
          // Authenticated state
          <AuthConnected>
            {/* Vote count */}
            <div>
              <span>{returnVoteCount()}</span>
            </div>

            {/* Address + lock button */}
            <Button onClick={unlock}>
              <span>
                {address.startsWith("0x")
                  ? // If ETH address, render truncated address
                    address.substr(0, 6) +
                    "..." +
                    address.slice(address.length - 4)
                  : // Else, render ENS name
                    address}
              </span>
            </Button>
          </AuthConnected>
        ) : (
          <Button onClick={connectWalletWithLoading}>
            Connect wallet
          </Button>
        )}
      </Auth>
    </Wrapper>
  );
}

export default Header;