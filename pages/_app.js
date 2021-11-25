import StateProvider from "@state/index";

import "../styles/globals.scss";
import "react-responsive-modal/styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Unify({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}
