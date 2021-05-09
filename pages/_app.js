// Utilities
import StateProvider from "@state/index"; // State provider wrapper

// Styles
import "../styles/globals.scss"; // Global styles
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; // Spinners

export default function Unify({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}
