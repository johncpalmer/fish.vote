import StateProvider from "@state/index";

import "react-responsive-modal/styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import GlobalStyle from "@styles/globals";

export default function Unify({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
      <GlobalStyle />
    </StateProvider>
  );
}
