import Head from "next/head"; // HTML head
import Link from "next/link"; // Routing
import Image from "next/image"; // Routing
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import Modal from "@components/Modal"; // Component: Modal
import vechain from "@state/vechain"; // Vechain state container
import governance from "@state/governance"; // Governance state container
import NextNProgress from "nextjs-progressbar"; // Navigation progress bar
import styles from "@styles/components/Layout.module.scss"; // Component styles
import { useState } from "react";

export default function Layout({ children, short, proposal }) {
  return (
    <div>
      {/* Navigation progress bar */}
      <NextNProgress
        color="#f5a788"
        startPosition={0.3}
        stopDelayMs={200}
        height="3"
        options={{
          showSpinner: false,
        }}
      />

      {/* Html head content */}
      <Meta proposal={proposal} />

      {/* Header */}
      <Header />

      {/* Page content */}
      <div
        className={`${styles.layout__content} ${
          // Fix padding on forced short top margin pages
          short ? styles.layout__content_short : ""
        }`}
      >
        <div className={styles.layout__content_sizer}>{children}</div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Meta({ proposal }) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      {proposal ? null : (
        // If not a proposal page, inject title
        <>
          <title>Vote | Vexchange</title>
          <meta property="og:title" content="Vote.vexchange" />
          <meta property="twitter:title" content="Vote.vexchange" />
        </>
      )}

      <meta name="title" content="Vote.vexchange" />
      <meta
        name="description"
        content="Crowd Proposals for Vexchange governance"
      />

      {/* Open Graph + Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://vote.vexchange.io" />
      <meta
        property="og:description"
        content="Crowd proposals for Vexchange governance"
      />
      <meta property="og:image" content="https://vote.vexchange.io/twitter-card.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://vote.vexchange.io" />
      <meta
        property="twitter:description"
        content="Crowd proposals for Vexchange governance"
      />
      <meta
        property="twitter:image"
        content="https://vote.vexchange.io/twitter-card.png"
      />

      {/* Favicon */}
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>"></link>

      {/* Fortmatic verification */}
      <meta name="fortmatic-site-verification" content="YB1r9idOuJBbDdbk" />

      {/* Fonts (Inter) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Google Analytics */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-SRPJSZBHN9"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SRPJSZBHN9');
          `,
        }}
      />
    </Head>
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
