import { css } from '@emotion/react'

const GlobalStyle = css`
  @font-face {
    font-family: "VCR";
    src: local("VCR"), url(/fonts/VCR_OSD_MONO.ttf) format("truetype");
  }

  // Global config
  * {
    --color-bg: #030309;
    --color-orange: #f5a788;

    --toastify-color-dark: #121218;
    --toastify-color-progress-dark: #f5a788;
    --toastify-color-success: #37C9AC;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    background-color: var(--color-bg);
    font-family: "Inter", sans-serif;
    font-size: 14px;
    height: 100%;
  }

  a {
    color: var(--color-orange);
    text-decoration: none;
    cursor: pointer;
  }

  * {
    box-sizing: border-box;
  }

  p {
    color: #ACACAB;
    line-height: 1.5;
    margin-top: 0;
  }

  // BNC Onboard lightbox setup
  .bn-onboard-modal {
    // Forcefully override all elements
    z-index: 99999;
  }

  // React-responsive-modal overrides
  .react-responsive-modal-overlay {
    backdrop-filter: blur(80px);
  }

  .react-responsive-modal-modal {
    background: #121218 !important;
    border-radius: 8px;
    max-width: 500px !important;
    width: calc(100% - 40px);
    padding: 24px !important;
  }

  #__next {
    height: 100%;
  }

  #__next > div {
    display: flex;
    flex-direction: column;
  }
`

export default GlobalStyle;
