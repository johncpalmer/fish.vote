import Head from "next/head"; // HTML head
import Link from "next/link"; // Routing
import eth from "@state/eth"; // ETH state container
import governance from "@state/governance"; // Governance state container
import NextNProgress from "nextjs-progressbar"; // Navigation progress bar
import styles from "@styles/components/Layout.module.scss"; // Component styles
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"; // Address -> Avatar

export default function Layout({ children }) {
  return (
    <div>
      {/* Navigation progress bar */}
      <NextNProgress
        color="#E7347A"
        startPosition={0.3}
        stopDelayMs={200}
        height="3"
        options={{
          showSpinner: false,
        }}
      />

      {/* Html head content */}
      <Meta />

      {/* Header */}
      <Header />

      {/* Page content */}
      <div className={styles.layout__content}>
        <div className={styles.layout__content_sizer}>{children}</div>
      </div>
    </div>
  );
}

function Meta() {
  return (
    <Head>
      {/* TODO: Meta */}
      {/* TODO: Favicon */}

      {/*Primary meta tags*/}
      <title>Fish.vote - Autonomous Proposals</title>
      <meta name="title" content="Fish.vote">
      <meta name="description" content="Autonomous proposals for UNI">

      {/*Open Graph / Facebook*/}
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://fish.vote/">
      <meta property="og:title" content="Fish.vote">
      <meta property="og:description" content="Autonomous proposals for UNI">
      <meta property="og:image" content="https://fish.vote/twitter-card.png">

      {/*Twitter*/}
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="https://fish.vote/">
      <meta property="twitter:title" content="Fish.vote">
      <meta property="twitter:description" content="Autonomous proposals for UNI">
      <meta property="twitter:image" content="https://fish.vote/twitter-card.png"></meta>

      {/* Fonts (Inter) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}

function Header() {
  // Collect user balance
  const { uni } = governance.useContainer();
  // Collect auth status and functions
  const { address, lock, unlock } = eth.useContainer();

  /**
   * Returns UNI balance for authenticated user
   * @returns {String}
   */
  const returnVoteCount = () => {
    // Locale decimals setting (max 2 decimal places)
    const localeDecimals = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };

    // When nil balance immediately show
    if (uni === 0) {
      return "0 UNI";
    }

    // If votes loaded
    return uni
      ? // Return formatted vote count
        `${uni.toLocaleString("us-en", localeDecimals)} UNI`
      : // Else, show loading status
        "Loading...";
  };

  return (
    <div className={styles.layout__header}>
      {/* Logo */}
      <div className={styles.layout__header_logo}>
        <Link href="/">
          <a>
            {/* Logo: Desktop */}
            <img
              className={styles.layout__header_logo_desktop}
              src="/vectors/logo-mobile.svg"
              alt="Fish logo"
            />

            {/* Logo: Mobile */}
            <img
              className={styles.layout__header_logo_mobile}
              src="/vectors/logo-mobile.svg"
              alt="Fish logo"
            />
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
            <button onClick={lock}>
              <span>
                {address.substr(0, 6) +
                  "..." +
                  address.slice(address.length - 4)}
              </span>
              <Jazzicon diameter={16} seed={jsNumberForAddress(address)} />
            </button>
          </div>
        ) : (
          // Unauthenticated state
          <button
            className={styles.layout__header_auth_connect}
            onClick={unlock}
          >
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}
