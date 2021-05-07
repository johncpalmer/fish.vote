import "../styles/globals.scss";
import StateProvider from "@state/index";

export default function Unify({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}
