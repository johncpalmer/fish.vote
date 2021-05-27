// Utilities
import StateProvider from "@state/index"; // State provider wrapper

// Styles
import "../styles/globals.scss"; // Global styles
import "react-responsive-modal/styles.css"; // Modal
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; // Spinners

export default function Unify({ Component, pageProps }) {
  return (
    // Wrap application in state provider
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}
