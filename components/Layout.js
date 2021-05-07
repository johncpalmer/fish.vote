import Head from "next/head";
import Link from "next/link";
import eth from "@state/eth";
import Jazzicon from "react-jazzicon";
import styles from "@styles/components/Layout.module.scss";

export default function Layout({ children }) {
  return (
    <div>
      {/* Html head content */}
      <Meta />

      {/* Header */}
      <Header />

      {/* Page content */}
      <div className={styles.layout__content}>{children}</div>
    </div>
  );
}

function Meta() {
  return (
    <Head>
      {/* TODO: Meta */}
      {/* TODO: Favicon */}

      {/* Fonts (Inter) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}

function Header() {
  const { address, lock, unlock } = eth.useContainer();

  return (
    <div className={styles.layout__header}>
      {/* Logo */}
      <div className={styles.layout__header_logo}>
        <Link href="/">
          <a>
            <img src="/vectors/logo.svg" alt="Unify logo" />
          </a>
        </Link>
      </div>

      {/* Authentication */}
      <div className={styles.layout__header_auth}>
        {address ? (
          // Authenticated state
          <div className={styles.layout__header_auth_connected}>
            <div>
              <span>232 votes</span>
            </div>
            <button onClick={lock}>
              <span>
                {address.substr(0, 6) +
                  "..." +
                  address.slice(address.length - 4)}
              </span>
              <Jazzicon diameter={16} seed={address} />
            </button>
          </div>
        ) : (
          // Unauthenticated state
          <button
            className={styles.layout__header_auth_connect}
            onClick={unlock}
          >
            Connect to a wallet
          </button>
        )}
      </div>
    </div>
  );
}
