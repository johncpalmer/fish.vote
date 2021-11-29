import StateProvider from "@state/index";
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-responsive-modal/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';

import GlobalStyle from "@styles/globals";

const StyledToastContainer = styled(ToastContainer)`
  top: 96px;
  .Toastify__toast-container {}
  .Toastify__toast {
    border-radius: 8px;
    border: 2px solid #f5a788;
  }
  .Toastify__toast-body {}
  .Toastify__progress-bar {}
`;

export default function Unify({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
      <GlobalStyle />
      <StyledToastContainer theme="dark" />
    </StateProvider>
  );
}
