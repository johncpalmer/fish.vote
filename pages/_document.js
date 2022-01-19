// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="title" content="gov.vexchange" />
          <meta name="description" content="Vexchange governance portal" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://gov.vexchange.io" />
          <meta property="og:description" content="Vexchange governance portal" />
          <meta property="og:image" content="https://gov.vexchange.io/twitter-card.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://vote.vexchange.io" />
          <meta
            property="twitter:description"
            content="Crowd proposals for Vexchange governance"
          />
          <meta
            property="twitter:image"
            content="https://gov.vexchange.io/twitter-card.png"
          />

          {/* Favicon */}
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>"></link>

          {/* Fortmatic verification */}
          <meta name="fortmatic-site-verification" content="YB1r9idOuJBbDdbk" />
          {/* Fonts (Inter) */}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
