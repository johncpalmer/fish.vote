import { Header, Logo, Auth, AuthConnected, AuthConnect } from './styled'

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
    <Header>
      <Logo>
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
          </AuthConnected>
        ) : (
          <div>
            <AuthConnect
              onClick={connectWalletWithLoading}>
              Connect wallet
            </AuthConnect>
          </div>
        )}
      </Auth>
    </Header>
  );
}

export default Header;