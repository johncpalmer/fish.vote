import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { isMobile } from 'react-device-detect';

import vechain from "@state/vechain";
import governance from "@state/governance";

import Meta from '@components/Meta';
import Modal from "@components/Modal";

import styles from "@styles/components/Layout.module.scss";

import { Content } from './styled'

export default function Layout({ children, short, proposal }) {
  return (
    <div>
      <Meta proposal={proposal} />

      <Header />

      <Content short={short}>
        <Sizer>{children}</Sizer>
      </Content>

      <Footer />
    </div>
  );
}

function Header() {
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
    <div className={styles.layout__header}>
      {/* Logo */}
      <div className={styles.layout__header_logo}>
        <Link href="/">
          <a
            style={{
              display: 'block' 
            }}
          >
            { isMobile ? (
              <Image
                className={styles.layout__header_logo_desktop}
                src="/vectors/logo-mobile.svg"
                alt="Vexchange logo"
                width={40}
                height={40}
              />
            ) : (
              <Image
                className={styles.layout__header_logo_desktop}
                src="/vectors/logo-mobile.svg"
                alt="Vexchange logo"
                width={40}
                height={40}
              />
            )}
          </a>
        </Link>
      </div>

      {/* Authentication */}
      <div className={styles.layout__header_auth}>
        {address ? (
          // Authenticated state
          <div className={styles.layout__header_auth_connected}>
            {/* Vote count */}
            <div>
              <span>{returnVoteCount()}</span>
            </div>

            {/* Address + lock button */}
            <button onClick={unlock}>
              <span>
                {address.startsWith("0x")
                  ? // If ETH address, render truncated address
                    address.substr(0, 6) +
                    "..." +
                    address.slice(address.length - 4)
                  : // Else, render ENS name
                    address}
              </span>
            </button>
          </div>
        ) : (
          <div>
            <button
              className={styles.layout__header_auth_connect}
              onClick={connectWalletWithLoading}>
              Connect wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className={styles.layout__footer}>

      {/* Footer: Left */}
      <div>
        <ul>
          <li>
            <a href="https://docs.vexchange.io/docs/v2" rel="noopener noreferrer" target="_blank">
              Docs
            </a>
          </li>
          <li>
            <a href="https://medium.com/vexchange" rel="noopener noreferrer" target="_blank">
              Blog
            </a>
          </li>
        </ul>
      </div>

      {/* Footer: Right */}
      <div>
        <ul>
          <li>
            <a
              href="https://discord.gg/krPDhtcumr" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
          <li>
            <a href="https://twitter.com/VexchangeIO" rel="noopener noreferrer" target="_blank">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://github.com/vexchange" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
